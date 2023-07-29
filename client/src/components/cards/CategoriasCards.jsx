import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaCode, FaChartLine, FaPen, FaMusic, FaCamera, FaCog, FaVial, FaHtml5, FaCss3, FaReact, FaPhp, } from 'react-icons/fa'
import { BiLogoJavascript } from 'react-icons/bi'

const CategoriasCards = () => {
  return (
    <>
      <section className="grid lg:grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1">
        <div className='border-b-2 border-[#F98FFF] col-span-4'>
          <h3 className='text-2xl text-yellow-400 mb-4'>
            Seja bem-vindo ao E-Learning, a plataforma que te permite aprender e ensinar.
          </h3>
        </div>
        <div className="p-4 bg-[#06000E] text-white border-2 border-[#571089] rounded-md sm:col-span-4 md:col-span-4 lg:col-span-1">
          <h3 className="text-lg uppercase font-bold text-green-400 mb-4">Top Habilidades</h3>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/desenvolvimento'>
            <FaCode className='text-2xl mr-4 font-bold text-pink-400' />
            <p className='text-white'>Desenvolvimento Web</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/marketing'>
            <FaChartLine className='text-2xl mr-4 text-pink-400' />
            <p className='text-white'>Marketing Digital</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/escrita'>
            <FaPen className='text-2xl mr-4 font-bold text-pink-400' />
            <p className='text-white'>Escrita</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/musica'>
            <FaMusic className='text-2xl font-bold mr-4 text-pink-400' />
            <p className='text-white'>Música</p>
          </NavLink>
        </div>
        <div className="p-4 bg-[#06000E] text-white border-2 border-[#571089] rounded-md sm:col-span-4 md:col-span-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-green-400 uppercase mb-4">Categorias</h3>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/design'>
            <FaCamera className='text-2xl mr-4 font-bold text-pink-400' />
            <p className='text-white'>Fotografia</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/negocios'>
            <FaCog className='text-2xl mr-4 font-bold text-pink-400' />
            <p className='text-white'>Negócios</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/ciencia'>
            <FaVial className='text-2xl mr-4 text-pink-400 font-bold' />
            <p className='text-white'>Ciência</p>
          </NavLink>
          <NavLink to='/programacao' className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out">
            <FaPhp className='text-2xl mr-4 text-pink-400 font-bold' />
            <p className='text-white'>Programação</p>
          </NavLink>
        </div>
        <div className="p-4 bg-[#06000E] text-white border-2 border-[#571089] rounded-md sm:col-span-4 md:col-span-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-green-400 uppercase mb-4">Topicos Populares</h3>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/html'>
            <FaHtml5 className='text-2xl mr-4 text-pink-400 font-bold' />
            <p className='text-white'>HTML</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/css'>
            <FaCss3 className='text-2xl mr-4 text-pink-400 font-bold' />
            <p className='text-white'>CSS</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/javascript'>
            <BiLogoJavascript className='text-2xl mr-4 text-pink-400 font-bold' />
            <p className='text-white'>JavaScript</p>
          </NavLink>
          <NavLink className="flex items-center mb-4 border border-gray-600 rounded-md p-4 hover:bg-gray-800 transition-all duration-300 ease-in-out" to='/react'>
            <FaReact className='text-2xl mr-4 text-pink-400 font-bold' />
            <p className='text-white'>React</p>
          </NavLink>
        </div>
        <div className="p-4 bg-[#06000E] text-white border-2 border-[#571089] rounded-md sm:col-span-4 md:col-span-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-green-400 uppercase mb-4">Ensine o que você ama</h3>
          <p className="mb-4 text-white">Ensine o que você ama. A E-learning te ajuda a transformar o que você sabe em oportunidade de ensino e renda.</p>
          <NavLink to="/registo-instrutor" className="border-2 border-pink-400 rounded-md px-4 py-2 block mb-4 text-pink-400 hover:text-green-400 hover:border-green-400 transition-colors duration-200">
            Torne-se um professor
          </NavLink>
        </div>
      </section>
    </>
  )
}

export default CategoriasCards