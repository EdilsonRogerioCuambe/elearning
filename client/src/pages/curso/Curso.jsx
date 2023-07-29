import React, { useEffect, useState, useCallback } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { FaBookmark, FaPlay } from 'react-icons/fa';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { AddVideoModal, Loading } from '../../components';
import { AiOutlineFolderAdd } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';

const Curso = () => {

  const { id } = useParams();
  const [curso, setCurso] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState({});

  const fetchCurso = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/cursos/${id}`);
      setCurso(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [id]);

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const tipoUsuario = localStorage.getItem('tipo');
      const token = localStorage.getItem('token');
      if (token && tipoUsuario === 'estudantes') {
        const res = await axios.get(`http://localhost:5000/api/estudantes/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, []);

  const inscreverNoCurso = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`http://localhost:5000/api/cursos/inscrever`, {
          cursoId: id,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchUsuario();
      }
    } catch (err) {
      console.log(err);
    }
  }, [id, usuario._id, fetchUsuario]);

  const desinscreverDoCurso = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`http://localhost:5000/api/cursos/desinscrever`, {
          cursoId: id,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchUsuario();
      }
    } catch (err) {
      console.log(err);
    }
  }, [id, usuario._id, fetchUsuario]);

  const favoritarCurso = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post(`http://localhost:5000/api/cursos/favoritar`, {
          cursoId: id,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchUsuario();
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }, [id, usuario._id, fetchUsuario]);

  const desfavoritarCurso = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post(`http://localhost:5000/api/cursos/desfavoritar`, {
          cursoId: id,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchUsuario();
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }, [id, usuario._id, fetchUsuario]);

  const apagarVideo = useCallback(async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Remove o vídeo apagado da lista de vídeos
        setCurso((prevState) => {
          return {
            ...prevState,
            videos: prevState.videos.filter(video => video._id !== videoId)
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchCurso();
    fetchUsuario();
  }, [fetchCurso, fetchUsuario, inscreverNoCurso, favoritarCurso, desfavoritarCurso, desinscreverDoCurso]);

  if (loading) {
    return <Loading legenda={'Carregando Curso...'} />
  }

  return (
    <>
      <Layout>
        <section className="mt-32 pb-8 mx-6 font-mono">
          <h1 className="text-5xl mb-8 font-bold text-blue-400">Detalhes do curso</h1>

          <div className="flex flex-wrap gap-12 items-start py-8 px-10 border-4 border-blue-500 rounded-lg shadow-lg">

            <div className="w-full">

              <div className="relative mt-4">
                <img
                  src={curso?.thumbnail}
                  alt={curso?.nome}
                  className="w-full h-56 object-cover rounded-lg shadow-md"
                />
                <span className="absolute bottom-0 right-0 bg-pink-600 px-3 py-1.5 rounded-lg text-white text-sm font-semibold">
                  {
                    curso?.videos?.length > 1 ? `${curso?.videos?.length} aulas` : `${curso?.videos?.length} aula`
                  }
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={curso?.instrutor?.foto}
                  alt={curso?.instrutor?.nome}
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div>
                  <h3 className="text-3xl font-bold uppercase">
                    {curso?.nome}
                  </h3>
                  <span className="text-gray-500 text-lg">por <NavLink to={`/professor/${curso?.instrutor?._id}`} className="text-green-500 font-semibold">{curso?.instrutor?.nome}</NavLink></span>
                </div>
              </div>

              <div className="">
                <h3 className="text-2xl font-bold text-red-400">Descrição</h3>
                <p className="py-4 leading-relaxed text-lg">{curso?.descricao}</p>
              </div>
            </div>

            <div className="flex flex-col justify-between lg:flex-row lg:justify-start lg:items-center">
              {usuario && !usuario?.cursosFavoritos?.map(cursoFavorito => cursoFavorito._id).includes(curso._id) ?
                <div className="mb-6">
                  <button
                    onClick={favoritarCurso}
                    type="submit"
                    className="flex items-center space-x-2 text-pink-600 border-2 border-pink-600 rounded-md px-4 py-2 hover:bg-pink-600 hover:text-white transition-all duration-300 ease-in-out"
                  >
                    <FaBookmark className="text-2xl" />
                    <span>
                      Favoritar
                    </span>
                  </button>
                </div>
                :
                <div className="mb-6">
                  <button
                    onClick={desfavoritarCurso}
                    type="submit"
                    className="flex items-center space-x-2 text-pink-600 border-2 border-pink-600 rounded-md px-4 py-2 hover:bg-pink-600 hover:text-white transition-all duration-300 ease-in-out"
                  >
                    <FaBookmark className="text-2xl" />
                    <span>
                      Desfavoritar
                    </span>
                  </button>
                </div>
              }

              {usuario && !usuario?.cursosInscritos?.map(cursoInscrito => cursoInscrito._id).includes(curso._id) ?
                <div className="mb-6 mx-4">
                  <button
                    onClick={inscreverNoCurso}
                    type="submit"
                    className="flex items-center space-x-2 text-green-500 border-2 border-green-500 rounded-md px-4 py-2 hover:bg-green-500 hover:text-white transition-all duration-300"
                  >
                    <FaBookmark className="text-2xl" />
                    <span>
                      Inscrever
                    </span>
                  </button>
                </div>
                :
                <div className="mb-6 mx-4">
                  <button
                    onClick={desinscreverDoCurso}
                    type="submit"
                    className="flex items-center space-x-2 text-green-500 border-2 border-green-500 rounded-md px-4 py-2 hover:bg-green-500 hover:text-white transition-all duration-300"
                  >
                    <FaBookmark className="text-2xl" />
                    <span>
                      Desinscrever
                    </span>
                  </button>
                </div>
              }

              {
                usuario?._id === curso?.instrutor?._id ? (
                  <>
                    <div className="mb-6">
                      <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center space-x-2 text-green-500 border-2 border-green-500 rounded-md px-4 py-2 hover:bg-green-500 hover:text-white transition-all duration-300"
                      >
                        <AiOutlineFolderAdd className="text-2xl" />
                        <span>
                          adicionar vídeo
                        </span>
                      </button>
                      <AddVideoModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setModalOpen(false)}
                        cursoId={id}
                        idProfessor={curso?.instrutor?._id}
                        getCurso={fetchCurso}
                      />
                    </div>
                  </>
                ) : null
              }
            </div>
          </div>
        </section>


        <section className="mx-6 font-mono">
          <h1 className="text-5xl mb-8 font-bold">Aulas</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:grip-cols-2 sm:grid-cols-1">
            {curso?.videos && curso?.videos?.map(video => (
              <div key={video?._id} className="border-2 border-green-500 rounded-md cursor-pointer">
                <NavLink
                  to={`/curso/${id}/aula/${video?._id}`}
                >
                  <div className="relative">
                    <img src={video?.thumbnail} alt={video?.titulo} className="w-full h-56 object-cover rounded-t-md" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-t-md">
                      <FaPlay className="text-4xl text-white hover:text-green-500 transition-all duration-300 ease-in-out" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl mb-4">{video?.titulo}</h3>
                    <p className="text-gray-400">
                      {video?.descricao.length > 100 ? `${video?.descricao.substring(0, 100)}...` : video?.descricao}
                    </p>
                  </div>
                </NavLink>
                {/* Se o usuário atual é o dono do vídeo, mostra o botão de apagar vídeo */}
                {usuario._id === curso.instrutor._id && (
                  <>
                    <div className="flex justify-end p-4">
                      <button
                        onClick={() => apagarVideo(video._id)}
                        className='border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out'
                      >
                        <BsTrash className="text-2xl" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

          </div>
        </section>
      </Layout>
    </>
  )
}

export default Curso