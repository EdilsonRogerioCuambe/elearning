import React, { useState, useEffect, useCallback } from 'react'
import { faker } from '@faker-js/faker'
import { FaUserCircle } from 'react-icons/fa'
import { CursosProfessor } from '../../components'
import Layout from '../../layout/Layout'
import axios from 'axios'
import { Loading } from '../../components'

const PerfilProfessor = () => {

  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState({});

  const fetchPerfil = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('http://localhost:5000/api/instrutores/perfil', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(data);
      setUsuario(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  if (loading) {
    return <Loading legenda={'Carregando Perfil...'} />
  }

  return (
    <>
      <Layout>
        <section className="mx-8 px-4 py-12 mt-32 font-mono border-2 border-green-500 rounded-md">
          <h1 className="text-4xl mb-8 uppercase">Perfil do Professor</h1>
          <div className="flex flex-col items-center mb-8">
            <img
              src={usuario?.foto}
              alt={usuario?.nome}
              className="w-full h-60 rounded-md object-cover"
            />
            <h3 className="text-2xl mb-2">
              {usuario?.nome}
            </h3>
            <span className="text-lg text-gray-400">Professor</span>
          </div>
          <div className="flex justify-around text-lg text-red-400">
            <p className="flex items-center gap-2 border-r-2 border-green-400 pr-4">
              Total Cursos: <span className="text-pink-600">
                {
                  usuario?.cursos?.length
                }
              </span></p>
            <p className="flex items-center gap-2 border-r-2 border-green-400 pr-4">
              Total Videos: <span className="text-pink-600">
                {usuario?.cursos?.reduce((acc, curso) => acc + curso?.videos?.length, 0)}
                </span>
            </p>
            <p className="flex items-center gap-2 border-r-2 border-green-400 pr-4">
              Total Estudantes: <span className="text-pink-600">
                {usuario?.cursos?.reduce((acc, curso) => acc + curso?.estudantes?.length, 0)}
              </span>
            </p>
            <p className="flex items-center gap-2 border-r-2 border-green-400 pr-4">
              Total Comentarios: <span className="text-pink-600">
                {usuario?.comentarios?.length}
              </span>
            </p>
          </div>
        </section>
        <CursosProfessor cursos={usuario?.cursos} usuario={usuario} />
      </Layout>
    </>
  )
}

export default PerfilProfessor