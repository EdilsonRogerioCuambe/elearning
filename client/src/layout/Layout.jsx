import React, { useState, useEffect, useCallback } from 'react';
import { Header, Sidebar, Footer } from '../components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Layout = (props) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario] = useState({}); // Adicionado um novo estado

  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');

  const getUsuario = useCallback(async () => {
    try {

      if (!token) {
        navigate('/login');
      }

      const res = await axios.get(`http://localhost:5000/api/${tipo}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsuario(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token, tipo]);

  // Verifica se o usuario esta logado, se esta logado, pega os dados do usuario
  useEffect(() => {
    getUsuario();
  }, [getUsuario]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} usuario={usuario} setUsuario={setUsuario} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} usuario={usuario} setUsuario={setUsuario} />
      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-80' : 'ml-0'}`} >
        {props.children}
        <Footer />
      </main>
    </>
  )
}

export default Layout;