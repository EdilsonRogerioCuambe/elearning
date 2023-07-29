import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  Home,
  Sobre,
  Curso,
  Assistir,
  Cursos,
  PerfilProfessor,
  Professores,
  Contato,
  PerfilEstudante,
  Login,
  Registo,
  AdicionarCurso,
  RegistoInstrutor,
} from './pages'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/curso/:id" element={<Curso />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/curso/:curso/aula/:aula" element={<Assistir />} />
          <Route path="/professores" element={<Professores />} />
          <Route path="/professor/:id" element={<PerfilProfessor />} />
          <Route path="/perfil/" element={<PerfilEstudante />} />
          <Route path="/addcurso" element={<AdicionarCurso />} />
          <Route path="/registo-instrutor" element={<RegistoInstrutor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App