import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaQuestion, FaGraduationCap, FaHeadset, FaChalkboardTeacher } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { BiLogInCircle } from 'react-icons/bi';

const Sidebar = ({ isOpen, usuario }) => {
  const location = useLocation();

  return (
    isOpen &&
    <div className='fixed font-mono top-0 left-0 w-80 h-screen bg-[#06000E] text-white shadow-md overflow-y-auto pb-6'>
      {
        usuario.nome ? (
          <div className='flex items-center justify-center flex-col p-6 mt-32'>
            <img src={usuario?.foto} alt={usuario?.nome} className='w-full h-44 rounded-md object-cover' />
            <h2 className='text-md font-bold mt-4'>
              {usuario?.nome}
            </h2>
            <p className='text-green-400 text-sm'>
              {usuario?.email}
            </p>
          </div>
        ) : (
          <div className='flex items-center justify-center flex-col p-6 mt-32'>
            <h2 className='text-xl font-bold mt-4'>
              Bem-vindo
            </h2>
            <p className='text-md'>Faça login para continuar</p>
            <NavLink
              to='/login'
              className='mt-4 py-2 px-4 text-pink-200 border-2 border-pink-400 rounded-md transition-all duration-300 ease-in-out hover:border-2 hover:border-pink-600 hover:text-pink-800'
            ><BiLogInCircle className='mr-2 inline-block' size={20} />
              Login
            </NavLink>
          </div>
        )
      }
      <nav>
        <NavLink
          to='/'
          className={`py-6 px-8 text-lg flex items-center hover:bg-gray-800 text-yellow-600 transition-all duration-300 ease-in-out ${location.pathname === '/' && 'bg-gray-800'}`}
        >
          <FaHome className='mr-4 transition-all duration-200' />
          <span>Home</span>
        </NavLink>
        <NavLink
          to='/sobre'
          className={`py-6 px-8 text-lg flex items-center hover:bg-gray-800 text-yellow-600 transition-all duration-300 ease-in-out ${location.pathname === '/sobre' && 'bg-gray-800'}`}
        >
          <FaQuestion className='mr-4 transition-all duration-200' />
          <span>Sobre</span>
        </NavLink>
        <NavLink
          to='/cursos'
          className={`py-6 px-8 text-lg flex items-center hover:bg-gray-800 text-yellow-600 transition-all duration-300 ease-in-out ${location.pathname === '/cursos' && 'bg-gray-800'}`}
        >
          <FaGraduationCap className='mr-4 transition-all duration-200' />
          <span>Cursos</span>
        </NavLink>
        <NavLink
          to='/professores'
          className={`py-6 px-8 text-lg flex items-center hover:bg-gray-800 text-yellow-600 transition-all duration-300 ease-in-out ${location.pathname === '/professores' && 'bg-gray-800'}`}
        >
          <FaChalkboardTeacher className='mr-4 transition-all duration-200' />
          <span>Professores</span>
        </NavLink>
        <NavLink
          to='/contato'
          className={`py-6 px-8 text-lg flex items-center hover:bg-gray-800 text-yellow-600 transition-all duration-300 ease-in-out ${location.pathname === '/contactos' && 'bg-gray-800'}`}
        >
          <FaHeadset className='mr-4 transition-all duration-200' />
          <span>Contato</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;