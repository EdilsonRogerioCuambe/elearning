import React, { useState, useEffect } from 'react';
import { Header, Sidebar, Footer } from '../components';
import axios from 'axios';

const Layout = (props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario] = useState({}); // Adicionado um novo estado

  // Verifica se o usuario esta logado, se esta logado, pega os dados do usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo');

    if (token && tipo) {
      const getUsuario = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/${tipo}/perfil`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUsuario(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getUsuario();
    }
  }, []);

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