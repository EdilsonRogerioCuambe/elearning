import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../layout/Layout';
import { CategoriasCards, CursosCards, Loading } from '../../components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Home = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({});
  const [isUserFavorited, setIsUserFavorited] = useState(false);

  const getUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const tipoUsuario = localStorage.getItem('tipo');
      const token = localStorage.getItem('token');
      if (token && tipoUsuario === 'estudantes') {
        const res = await axios.get(`${API_BASE_URL}/${tipoUsuario}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data);
        navigate('/');
      } else if (token && tipoUsuario === 'instrutores') {
        const res = await axios.get(`${API_BASE_URL}/${tipoUsuario}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [navigate]);

  const getCursos = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cursos`);
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
  }, [getUsuario, getCursos]);

  const favoritarCurso = useCallback(async (cursoId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${API_BASE_URL}/cursos/favoritar`,
          {
            cursoId: cursoId,
            estudanteId: usuario._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setIsUserFavorited(true);
      }
    } catch (err) {
      console.log(err);
    }
  }, [usuario._id]);

  const desfavoritarCurso = useCallback(async (cursoId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${API_BASE_URL}/cursos/desfavoritar`,
          {
            cursoId: cursoId,
            estudanteId: usuario._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setIsUserFavorited(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, [usuario._id]);

  useEffect(() => {
    setIsUserFavorited(
      usuario?.cursosFavoritos?.some(cursoFavorito => cursos.map(curso => curso._id).includes(cursoFavorito?._id))
    );
  }, [usuario, cursos]);

  if (loading) {
    return <Loading legenda={'Carregando Cursos...'} />;
  }

  return (
    <>
      <Layout>
        <div className='px-8 py-12 mt-20 font-mono'>
          <CategoriasCards />
          <CursosCards cursos={cursos} usuario={usuario} favoritarCurso={favoritarCurso} desfavoritarCurso={desfavoritarCurso} isUserFavorited={isUserFavorited} />
        </div>
      </Layout>
    </>
  );
};

export default Home;