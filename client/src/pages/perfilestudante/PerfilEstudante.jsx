import React, { useState, useEffect, useCallback } from 'react';
import { PiCertificate } from 'react-icons/pi';
import { BsFillStarFill, BsFillPersonFill } from 'react-icons/bs';
import { IoIosSchool, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { CursosInscritos, CursosFavoritados, CursosConcluidos, CertifcadoPDF } from '../../components';
import Layout from '../../layout/Layout';
import axios from 'axios';
import { Loading } from '../../components';

const PerfilEstudante = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState({});

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`http://localhost:5000/api/estudantes/perfil`, {
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

  console.log(usuario);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  if (loading) {
    return <Loading legenda={'Carregando suas informações...'} />
  }

  console.log(usuario.certificados);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-4 border-green-500 p-4 rounded shadow">
                <img
                  src={usuario.foto}
                  alt={usuario.nome}
                  className="w-full h-60 rounded-md object-cover mb-2"
                />
                <h2 className="text-xl mb-2">Nome: {usuario.nome}</h2>
                <h2 className="text-xl mb-2">Email: {usuario.email}</h2>
                <h2 className="text-xl mb-2">Data de Nascimento: {new Date(usuario.dataNascimento).toLocaleDateString(
                  'pt-BR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }
                )}</h2>
                <h2 className="text-xl mb-2">CPF: {usuario.cpf}</h2>
                <h2 className="text-xl mb-2">Endereço: {usuario.endereco}</h2>
              </div>
            </div>
          </>
        );
      case 'cursosInscritos':
        return (
          <>
            <CursosInscritos cursosInscritos={usuario.cursosInscritos} />
          </>
        );
      case 'cursosFavoritos':
        return (
          <>
            <CursosFavoritados cursosFavoritados={usuario.cursosFavoritos} />
          </>
        );
      case 'cursosConcluidos':
        return (
          <>
            <CursosConcluidos CursosConcluidos={usuario.cursosConcluidos} />
          </>
        );
      case 'certificados':
        return (
          <>
            <CertifcadoPDF certificados={usuario.certificados} />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <Layout>
      <div className="container font-mono mx-auto px-4 py-8 mt-32">
        <nav className="mb-8">
          <ul className="border-b border-3 border-pink-400 flex">
            <li className={`mr-1 ${activeTab === 'perfil' ? 'border-l border-t border-r rounded-t border-green-400' : ''}`}>
              <button onClick={() => setActiveTab('perfil')} className={`block py-2 px-4 uppercase cursor-pointer ${activeTab === 'perfil' ? 'text-pink-400' : 'text-pink-500'}`}>
                <BsFillPersonFill className="inline-block mr-1" />
                Perfil
              </button>
            </li>
            <li className={`mr-1 ${activeTab === 'cursosInscritos' ? 'border-l border-t border-r rounded-t border-green-400' : ''}`}><button onClick={() => setActiveTab('cursosInscritos')} className={`block py-2 px-4 uppercase cursor-pointer ${activeTab === 'cursosInscritos' ? 'text-pink-400' : 'text-pink-500'}`}><IoIosSchool className="inline-block mr-1" />Cursos Inscritos</button></li>
            <li className={`mr-1 ${activeTab === 'cursosFavoritos' ? 'border-l border-t border-r rounded-t border-green-400' : ''}`}><button onClick={() => setActiveTab('cursosFavoritos')} className={`block py-2 px-4 cursor-pointer uppercase ${activeTab === 'cursosFavoritos' ? 'text-pink-400' : 'text-pink-500'}`}><BsFillStarFill className="inline-block mr-1" />Cursos Favoritos</button></li>
            <li className={`mr-1 ${activeTab === 'cursosConcluidos' ? 'border-l border-t border-r rounded-t border-green-400' : ''}`}><button onClick={() => setActiveTab('cursosConcluidos')} className={`block py-2 px-4 cursor-pointer uppercase ${activeTab === 'cursosConcluidos' ? 'text-pink-400' : 'text-pink-500'}`}><IoMdCheckmarkCircleOutline className="inline-block mr-1" />Cursos Concluídos</button></li>
            <li className={`mr-1 ${activeTab === 'certificados' ? 'border-l border-t border-r rounded-t border-green-400' : ''}`}><button onClick={() => setActiveTab('certificados')} className={`block py-2 px-4 cursor-pointer uppercase ${activeTab === 'certificados' ? 'text-pink-400' : 'text-pink-500'}`}><PiCertificate className="inline-block mr-1" />Certificados</button></li>
          </ul>
        </nav>
        <div>
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  )
}

export default PerfilEstudante;