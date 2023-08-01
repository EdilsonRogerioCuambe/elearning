import React, { useState, useCallback, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Layout from '../../layout/Layout'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '../../components'

const Professores = () => {
  const [loading, setLoading] = useState(false)
  const [tutores, setTutores] = useState([])

  const fetchTutores = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.get('http://localhost:5000/api/instrutores/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(data);
      setTutores(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTutores()
  }, [fetchTutores])

  if (loading) {
    return <Loading legenda={'Carregando Tutores...'} />
  }

  console.log(tutores);

  return (
    <Layout>
      <section className="mt-24 mx-4 px-4 py-12 font-mono rounded-md">
        <h1 className="text-4xl mb-8 uppercase">Professores</h1>

        <form className="flex items-center gap-6 mb-8 p-2 rounded-md shadow-md border-2 bg-transparent border-green-500">
          <input className="w-full py-2 px-4 rounded-md bg-transparent text-lg outline-none" type="text" name="search_box" placeholder="Pesquisar Tutores..." required maxLength="100" />
          <button type="submit" className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition-all duration-300">
            <FaSearch />
          </button>
        </form>

        <div className="grid grid-cols-1 gap-2 justify-center items-start lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          {tutores.map((tutor, index) => (
            <div
              className="box p-8 rounded-md shadow-md border-2 border-purple-500"
              key={index}
            >
              <div className="tutor flex items-center gap-4 mb-6">
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={tutor.foto}
                  alt={tutor.nome}
                />
                <div>
                  <h3 className="text-xl uppercase font-bold text-green-500 pb-1">
                    {tutor.nome}
                  </h3>
                  <span className="text-gray-500">
                    {tutor.tipoUsuario}
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-500 py-1">Total Playlists : <span className="text-green-500">{tutor?.cursos?.length}</span></p>
              <p className="text-lg text-gray-500 py-1">
                Total Videos : {' '}
                <span className="text-green-500">
                  {
                    tutor?.cursos?.reduce((acc, curso) => {
                      return acc + curso?.videos?.length
                    }, 0)
                  }
                </span>
              </p>
              <p className="text-lg text-gray-500 py-1 mb-2">
                Total Estudantes : {' '}
                <span className="text-green-500">
                  {
                    tutor?.cursos?.reduce((acc, curso) => {
                      return acc + curso?.estudantes?.length
                    }, 0)
                  }
                </span>
              </p>
              <p className="text-lg text-gray-500 py-1 mb-2">
                Total Comentarios : {' '}
                <span className="text-green-500">
                  {
                    tutor?.cursos && tutor?.cursos?.reduce((acc, curso) => {
                      return acc + curso?.comentarios?.length || 0
                    }, 0)
                  }
                </span>
              </p>
              <NavLink
                to={`/professor/${tutor._id}`}
                className="border-2 border-red-500 rounded-md px-4 py-2 text-red-500 font-mono hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Ver Perfil
              </NavLink>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default Professores
