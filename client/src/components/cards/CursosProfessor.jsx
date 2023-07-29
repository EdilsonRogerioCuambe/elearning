import React from 'react'
import { MdVerifiedUser } from 'react-icons/md';

const CursosProfessor = ({ cursos, usuario }) => {
  return (
    <>
      <section className="p-10">
        <h1 className="text-4xl mb-10 uppercase text-green-500 font-mono">Seus Cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {cursos?.map((curso) => (
            <div key={curso?._id} className="rounded-lg overflow-hidden shadow-lg border-2 border-green-500 bg-transparent cursor-pointer">
              <img src={curso.thumbnail} alt={curso.nome} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-green-500 font-mono">{curso.nome}</h3>
                <p className="text-white text-base font-mono">
                  {curso?.descricao?.length > 75 ? curso?.descricao?.substring(0, 75) + '...' : curso?.descricao}
                </p>
                <div className="flex items-center mt-4">
                  <img src={usuario?.foto} alt={usuario?.nome} className="w-10 h-10 rounded-full object-cover" />
                  <p className="text-white text-sm ml-2 font-serif">{usuario.nome}</p>
                  <MdVerifiedUser className="text-green-500 text-md ml-2" />
                </div>
                <div className="flex justify-between mt-4">
                  <p className="text-white text-sm font-mono">Preço: <span
                    className="text-green-500 font-bold"
                  >{curso.preco === 0 ? 'Gratis' : ` R$${curso?.preco}`}</span></p>
                  <p className="text-white text-sm font-mono">Alunos: <span className="text-green-500 font-bold">{curso?.estudantes?.length}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default CursosProfessor