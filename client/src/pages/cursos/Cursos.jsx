import React, { useEffect, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { AiFillEye, AiFillHeart } from 'react-icons/ai';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { Loading } from '../../components';
import { FaRegHeart } from 'react-icons/fa';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({});

  const getCursos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/cursos');
      setCursos(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCursos();
    setLoading(false);
  }, [getCursos]);

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const tipoUsuario = localStorage.getItem('tipo');
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`http://localhost:5000/api/${tipoUsuario}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, []);

  const favoritarCurso = useCallback(async (cursoId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post(`http://localhost:5000/api/cursos/favoritar`, {
          cursoId: cursoId,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Atualiza o estado do usuário diretamente ao favoritar um curso
        setUsuario((prevState) => {
          return {
            ...prevState,
            cursosFavoritos: [...prevState.cursosFavoritos, cursoId] // adiciona o id do curso favoritado no array de cursos favoritos do usuário
          }
        });
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [usuario._id]);

  const desfavoritarCurso = useCallback(async (cursoid) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post(`http://localhost:5000/api/cursos/desfavoritar`, {
          cursoId: cursoid,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Atualiza o estado do usuário diretamente ao desfavoritar um curso
        setUsuario((prevState) => {
          return {
            ...prevState,
            cursosFavoritos: prevState.cursosFavoritos.filter(cursoId => cursoId !== cursoid) // remove o id do curso desfavoritado do array de cursos favoritos do usuário
          }
        });
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [usuario._id]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  if (loading) {
    return <Loading legenda={'Carregando Cursos...'} />
  }

  return (
    <>
      <Layout>
        <section className="mt-32 px-10">
          <h1 className="text-3xl mb-10 uppercase text-green-500 font-mono">Cursos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {cursos.map((curso) => (
              <div key={curso._id} className="rounded-lg overflow-hidden shadow-lg border-2 border-green-500 bg-transparent cursor-pointer">
                <img src={curso.thumbnail} alt={curso.nome} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 text-green-500 font-mono">{curso.nome}</h3>
                  <p className="text-white text-base font-mono">
                    {curso.descricao.length > 75 ? curso.descricao.substring(0, 75) + '...' : curso.descricao}
                  </p>
                  <div className="flex items-center mt-4">
                    <img src={curso.instrutor.foto} alt={curso.instrutor.nome} className="w-10 h-10 rounded-full object-cover" />
                    <p className="text-white text-sm ml-2 font-serif">{curso.instrutor.nome}</p>
                    <MdVerifiedUser className="text-green-500 text-md ml-2" />
                  </div>
                  <div className="flex justify-between mt-4">
                    <p className="text-white text-sm font-mono">Preço: <span
                      className="text-green-500 font-bold"
                    >{curso.preco === 0 ? 'Gratis' : ` R$${curso.preco}`}</span></p>
                    <p className="text-white text-sm font-mono">Alunos: <span className="text-green-500 font-bold">{curso.estudantes.length}</span></p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <NavLink to={`/curso/${curso._id}`} className={'border-2 border-green-500 rounded-md px-4 py-2 text-green-500 font-mono hover:bg-green-500 hover:text-white transition-all duration-300'}>
                      <AiFillEye className='inline-block mr-2 text-2xl' /> Ver Curso
                    </NavLink>
                    {
                      usuario?.cursosFavoritos?.includes(curso?._id) ?
                        <button
                          onClick={() => desfavoritarCurso(curso?._id)}
                          className={'border-2 border-red-400 rounded-md px-4 py-2 text-red-400 font-mono transition-all duration-300'}
                        >
                          <AiFillHeart className='inline-block mx-auto text-2xl' />
                        </button>
                        :
                        <button
                          onClick={() => favoritarCurso(curso?._id)}
                          className={'border-2 border-green-500 rounded-md px-4 py-2 text-green-500 font-mono transition-all duration-300'}
                        >
                          <FaRegHeart className='inline-block mx-auto text-2xl' />
                        </button>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  )
}

export default Cursos