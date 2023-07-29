import Cursos from '../models/curso.model.js';
import asyncHandler from 'express-async-handler';
import Instrutor from '../models/instrutor.model.js';
import Estudante from '../models/estudante.model.js';

// @desc    Registra um novo curso
// @route   POST /api/cursos
// @access  Privado
export const registrarCurso = asyncHandler(async (req, res) => {
  const {
    nome,
    descricao,
    preco,
    categoria,
    instrutor,
  } = req.body;

  const thumbnail = req.file.path;

  try {
    const curso = await Cursos.create({
      nome,
      descricao,
      thumbnail,
      preco,
      categoria,
      instrutor,
    });

    const instrutorEncontrado = await Instrutor.findById(instrutor);

    if (instrutorEncontrado) {
      instrutorEncontrado.cursos.push(curso._id);
      await instrutorEncontrado.save();
    }

    if (curso) {
      return res.json({
        message: 'Curso registrado com sucesso',
        curso,
      });
    } else {
      res.status(400);
      throw new Error('Dados inválidos');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Lista todos os cursos
// @route   GET /api/cursos
// @access  Público
export const listarCursos = asyncHandler(async (req, res) => {
  const cursos = await Cursos.find({}).populate('instrutor', 'nome foto');

  try {
    if (cursos) {
      res.json(cursos);
    } else {
      res.status(404);
      throw new Error('Cursos não encontrados');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Lista um curso pelo ID
// @route   GET /api/cursos/:id
// @access  Público
export const listarCursoPorId = asyncHandler(async (req, res) => {
  const curso = await Cursos.findById(req.params.id)
    .populate('instrutor', '_id nome foto tipoUsuario')
    .populate('videos', '_id titulo thumbnail descricao duracao');

  try {
    if (curso) {
      res.json(curso);
    } else {
      res.status(404);
      throw new Error('Curso não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Atualiza um curso
// @route   PUT /api/cursos/:id
// @access  Privado
export const atualizarCurso = asyncHandler(async (req, res) => {
  const {
    nome,
    descricao,
    thumbnail,
    preco,
    categoria,
  } = req.body;

  try {
    const curso = await Cursos.findById(req.params.id);

    if (curso) {
      curso.nome = nome;
      curso.descricao = descricao;
      curso.thumbnail = thumbnail;
      curso.preco = preco;
      curso.categoria = categoria;

      const cursoAtualizado = await curso.save();

      res.json({
        _id: cursoAtualizado._id,
        nome: cursoAtualizado.nome,
        descricao: cursoAtualizado.descricao,
        thumbnail: cursoAtualizado.thumbnail,
        preco: cursoAtualizado.preco,
        categoria: cursoAtualizado.categoria,
        instrutor: cursoAtualizado.instrutor,
      });
    } else {
      res.status(404);
      throw new Error('Curso não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Deleta um curso
// @route   DELETE /api/cursos/:id
// @access  Privado
export const deletarCurso = asyncHandler(async (req, res) => {
  const curso = await Cursos.findById(req.params.id);

  try {
    if (curso) {
      await curso.deleteOne()
      res.json({ message: 'Curso removido' });
    } else {
      res.status(404);
      throw new Error('Curso não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc Inscrever um estudante no curso
// @route POST /api/cursos/inscrever
// @access Privado
export const inscreverEstudante = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso || !estudante) {
      res.status(400);
      throw new Error('Curso ou estudante não encontrado');
    }

    // Verifica se o estudante já está inscrito no curso
    if (curso.estudantes.includes(estudante._id)) {
      res.status(400);
      throw new Error('Estudante já está inscrito no curso');
    }

    // Verifica se o curso já está na lista de cursos inscritos do estudante
    if (estudante.cursosInscritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso já está na lista de cursos inscritos do estudante');
    }

    curso.estudantes = curso.estudantes || [];
    estudante.cursos = estudante.cursos || [];

    curso.estudantes.push(estudante._id);
    estudante.cursosInscritos.push(curso._id);

    await curso.save();
    await estudante.save();

    res.json({ message: 'Estudante inscrito com sucesso no curso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Lista os cursos inscritos pelo estudante
// @route   GET /api/cursos/inscricoes
// @access  Privado
export const listarCursosInscritos = asyncHandler(async (req, res) => {
  const estudante = await Estudante.findById(req.estudante._id).populate('cursos');

  try {
    if (estudante) {
      res.json(estudante.cursos);
    } else {
      res.status(404);
      throw new Error('Estudante não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Favoritar um curso
// @route   POST /api/cursos/favoritar
// @access  Privado
export const favoritarCurso = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso || !estudante) {
      res.status(400);
      throw new Error('Curso ou estudante não encontrado');
    }

    // Verifica se o curso já está na lista de favoritos
    if (estudante.cursosFavoritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso já favoritado');
    }

    estudante.cursosFavoritos.push(curso._id);
    await estudante.save();

    res.json({ message: 'Curso favoritado com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Se desinscrever de um curso
// @route   DELETE /api/cursos/desinscrever
// @access  Privado
export const desinscreverCurso = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso) {
      res.status(400);
      throw new Error('Curso não encontrado');
    }

    if (!estudante) {
      res.status(400);
      throw new Error('Estudante não encontrado');
    }

    // Verifica se o estudante está inscrito no curso
    if (!curso.estudantes.includes(estudante._id)) {
      res.status(400);
      throw new Error('Estudante não está inscrito no curso');
    }

    // Verifica se o curso está na lista de cursos inscritos do estudante
    if (!estudante.cursosInscritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso não está na lista de cursos inscritos do estudante');
    }

    // Remove o curso da lista de cursos inscritos do estudante
    estudante.cursosInscritos.pull(curso._id);
    curso.estudantes.pull(estudante._id);
    await curso.save();
    await estudante.save();

    res.json({ message: 'Estudante desinscrito com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Desfavoritar um curso
// @route   DELETE /api/cursos/favoritar
// @access  Privado
export const desfavoritarCurso = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso || !estudante) {
      res.status(400);
      throw new Error('Curso ou estudante não encontrado');
    }

    // Verifica se o curso está na lista de favoritos
    if (!estudante.cursosFavoritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso não está favoritado');
    }

    estudante.cursosFavoritos.pull(curso._id);
    await estudante.save();

    res.json({ message: 'Curso desfavoritado com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
