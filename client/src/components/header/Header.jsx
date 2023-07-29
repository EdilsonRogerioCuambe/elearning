import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GiBookshelf } from 'react-icons/gi';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { BiLogInCircle } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';

const Header = ({ toggleSidebar, usuario, setUsuario }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false); // adicionado um novo estado

  const tipo = localStorage.getItem('tipo');

  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen); // altera o estado ao clicar
    toggleSidebar(); // continua a chamar a função toggleSidebar
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setDropdownOpen(false);
    setUsuario({});
  }

  return (
    <header className='fixed font-mono top-0 w-full z-50 border-b-2 border-teal-600 bg-[#06000E] shadow-md'>
      <div className='flex items-center justify-between p-6'>
        <NavLink to="/" className='text-yellow-600 text-2xl uppercase tracking-wider'>E-Learning</NavLink>
        <div className='relative w-1/2'>
          <input type="search" placeholder="Pesquisar..." maxLength={100} className='bg-[#06000E] w-full pl-8 pr-10 py-2 rounded-md text-white border-b-2 border-teal-600 outline-none' />
          <button type='submit' className='absolute left-2 top-1/2 transform -translate-y-1/2 text-red-800 text-xl hover:text-yellow-600'><BiSearchAlt /></button>
        </div>
        <div className='flex items-center ml-4 space-x-4'>
          {isMenuOpen
            ? <FaTimes onClick={handleMenuClick} className='text-yellow-600 text-2xl cursor-pointer' />
            : <AiOutlineMenu onClick={handleMenuClick} className='text-yellow-600 text-2xl cursor-pointer' />}
          <NavLink to='/cursos' className='text-yellow-600 text-xl'><GiBookshelf /></NavLink>
          <div className='text-yellow-600 text-xl'><IoMdNotificationsOutline /></div>
          <div onClick={() => setDropdownOpen(!isDropdownOpen)} className='relative'>
            <AiOutlineUser className='text-yellow-600 text-xl cursor-pointer' />
            {isDropdownOpen &&
              <div className='bg-[#06000E] border-2 border-teal-600 rounded-md transition-all duration-300 absolute top-12 right-0 w-64 p-4'>

                {
                  usuario.nome ? (
                    <>
                      <img
                        src={usuario.foto}
                        alt={usuario.nome}
                        className='h-20 w-20 rounded-full object-cover mb-4'
                      />
                      <h3 className='mb-2 text-xl text-green-400'>{usuario.nome}</h3>
                      <p className='mb-4 text-red-400'>
                        {tipo === 'estudantes' ? 'Estudante' : 'Instrutor'}
                      </p>
                      <NavLink to='/perfil' className='border-2 border-yellow-400 rounded-md px-4 py-2 block mb-4 text-yellow-400 hover:text-white hover:bg-yellow-400 transition-colors duration-200'>
                        Ver Perfil <BiUser className='inline-block hover:translate-x-2 transition-all duration-300' size={20} />
                      </NavLink>
                      {
                        tipo === 'instrutores' && (
                          <NavLink
                            to='/addcurso'
                            className={`border-2 border-green-400 rounded-md px-4 py-2 block mb-4 text-green-400 hover:text-white hover:bg-green-400 transition-colors duration-200`}
                          >
                            Adicionar Curso <GiBookshelf className='inline-block hover:translate-x-2 transition-all duration-300' size={20} />
                          </NavLink>
                        )
                      }
                      <button onClick={handleLogout} className='border-2 border-red-400 rounded-md px-4 py-2 text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-200'>
                        Logout <BiLogInCircle
                          className='inline-block hover:translate-x-2 transition-all duration-300'
                          size={20}
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className='mt-4 flex justify-between'>
                        <NavLink to='/login' className='block border-2 border-yellow-400 rounded-md px-4 py-2 mr-2 hover:bg-yellow-400 hover:text-white transition-colors duration-200'>
                          Login <BiLogInCircle className='inline-block' />
                        </NavLink>
                        <NavLink to='/registo' className='border-2 border-yellow-400 rounded-md px-4 py-2 inline-block hover:bg-yellow-400 hover:text-white transition-colors duration-200'>
                          Registo <BiLogInCircle className='inline-block' />
                        </NavLink>
                      </div>
                    </>
                  )
                }
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;