import React from 'react'
import { NavLink } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';

const CursosFavoritados = ({ cursosFavoritados }) => {
  return (
    <>
      <section className="pt-10">
        <h1 className="text-4xl mb-10 uppercase text-green-400 font-bold font-mono">Cursos Favoritados</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {cursosFavoritados.map((curso) => (
            <div key={curso._id} className="rounded-lg overflow-hidden shadow-lg border-2 border-green-400 bg-transparent cursor-pointer">
              <img src={curso?.thumbnail} alt={curso?.nome} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-green-400 font-mono">{curso?.nome}</h3>
                <p className="text-white text-base font-mono">
                  {curso?.descricao?.length > 75 ? curso?.descricao?.substring(0, 75) + '...' : curso?.descricao}
                </p>
                <div className="flex items-center mt-4">
                  <img src={curso?.instrutor?.foto} alt={curso?.instrutor?.nome} className="w-10 h-10 rounded-full object-cover" />
                  <p className="text-white text-sm ml-2 font-serif">{curso?.instrutor?.nome}</p>
                  <MdVerifiedUser className="text-green-400 text-md ml-2" />
                </div>
                <div className="flex justify-between mt-4">
                  <NavLink to={`/curso/${curso._id}`} className={'border-2 border-green-400 rounded-md px-4 py-2 text-green-400 font-mono hover:bg-green-400 hover:text-white transition-all duration-300'}>
                    <AiFillEye className='inline-block mr-2 text-2xl' /> Ver Curso
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default CursosFavoritados