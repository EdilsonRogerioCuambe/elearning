import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../layout/Layout'
import { CategoriasCards, CursosCards, Loading } from '../../components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({});

  const getUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const tipoUsuario = localStorage.getItem('tipo');
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/${tipoUsuario}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsuario(res.data);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [navigate]);

  const getCursos = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cursos');
      setCursos(res.data);
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getUsuario();
    getCursos();
  }, [getCursos, getUsuario]);

  const favoritarCurso = useCallback(async (cursoId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`http://localhost:5000/api/cursos/favoritar`, {
          cursoId: cursoId,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        getUsuario();
      }
    } catch (err) {
      console.log(err);
    }
  }, [usuario._id, getUsuario]);

  const desfavoritarCurso = useCallback(async (cursoid) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`http://localhost:5000/api/cursos/desfavoritar`, {
          cursoId: cursoid,
          estudanteId: usuario._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        getUsuario();
      }
    } catch (err) {
      console.log(err);
    }
  }, [usuario._id, getUsuario]);

  if (loading) {
    return <Loading legenda={'Carregando Cursos...'} />
  }

  return (
    <>
      <Layout>
        <div className='px-8 py-12 mt-20 font-mono'>
          <CategoriasCards />
          <CursosCards cursos={cursos} usuario={usuario} favoritarCurso={favoritarCurso} desfavoritarCurso={desfavoritarCurso} />
        </div>
      </Layout>
    </>
  )
}

export default Home
