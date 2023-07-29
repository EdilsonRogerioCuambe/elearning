import React from 'react'
import { NavLink } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { AiFillEye, AiFillHeart } from 'react-icons/ai';
import { cursos } from '../../data/CursosData';

const CursosConcluidos = () => {
  return (
    <>
          <section className="pt-10">
        <h1 className="text-4xl mb-10 uppercase text-green-500 font-mono">Cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {cursos.map((curso) => (
            <div key={curso.id} className="rounded-lg overflow-hidden shadow-lg border-2 border-green-500 bg-transparent cursor-pointer">
              <img src={curso.imagem} alt={curso.titulo} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-green-500 font-mono">{curso.titulo}</h3>
                <p className="text-white text-base font-mono">
                  {curso.descricao.length > 75 ? curso.descricao.substring(0, 75) + '...' : curso.descricao}
                </p>
                <div className="flex items-center mt-4">
                  <img src={curso.professorImagem} alt={curso.professor} className="w-10 h-10 rounded-full object-cover" />
                  <p className="text-white text-sm ml-2 font-serif">{curso.professor}</p>
                  <MdVerifiedUser className="text-green-500 text-md ml-2" />
                </div>
                <div className="flex justify-between mt-4">
                  <p className="text-white text-sm font-mono">Preço: <span
                    className="text-green-500 font-bold"
                  >{curso.preco === 0 ? 'Gratis' : ` R$${curso.preco}`}</span></p>
                  <p className="text-white text-sm font-mono">Alunos: <span className="text-green-500 font-bold">{curso.alunos}</span></p>
                </div>
                <div className="flex justify-between mt-4">
                  <NavLink to={`/curso/${curso.id}`} className={'border-2 border-green-500 rounded-md px-4 py-2 text-green-500 font-mono hover:bg-green-500 hover:text-white transition-all duration-300'}>
                    <AiFillEye className='inline-block mr-2 text-2xl' /> Ver Curso
                  </NavLink>
                  <button className={'border-2 border-red-500 rounded-md px-4 py-2 text-red-500 font-mono hover:bg-red-500 hover:text-white transition-all duration-300'}>
                    <AiFillHeart className='text-2xl' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default CursosConcluidos