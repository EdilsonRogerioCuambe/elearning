import Estudante from '../models/estudante.model.js';
import asyncHandler from 'express-async-handler';
import { generateUserToken } from '../utils/auth.utils.js';
import bcrypt from 'bcrypt';

// @desc    Registra um novo estudante
// @route   POST /api/estudantes
// @access  Público
export const registrarEstudante = asyncHandler(async (req, res) => {
  const {
    nome,
    email,
    senha,
    endereco,
    dataNascimento,
    cpf,
    sexo,
    telefone,
  } = req.body;

  const fotoUrl = req.file.path;

  const estudanteExiste = await Estudante.findOne({ email });

  if (estudanteExiste) {
    res.status(400);
    throw new Error('Estudante já existe');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const estudante = await Estudante.create({
      nome,
      email,
      senha: hashedPassword,
      endereco,
      dataNascimento,
      cpf,
      sexo,
      foto: fotoUrl,
      telefone,
    });

    if (estudante) {
      generateUserToken(Estudante, req, res);
    } else {
      res.status(400);
      throw new Error('Dados inválidos');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Autentica um estudante
// @route   POST /api/estudantes/login
// @access  Público
export const autenticarEstudante = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const estudante = await Estudante.findOne({ email });

  console.log(estudante);

  if (!estudante) {
    res.status(401);
    throw new Error('Estudante não encontrado');
  }

  try {
    const senhaCorreta = await bcrypt.compare(senha, estudante.senha);

    if (senhaCorreta) {
      generateUserToken(Estudante, req, res);
    } else {
      res.status(401);
      throw new Error('Credenciais inválidas');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Retorna o perfil de um estudante
// @route   GET /api/estudantes/perfil
// @access  Privado
export const getEstudanteProfile = asyncHandler(async (req, res) => {
  const estudante = await Estudante.findById(req.userId)
    .populate({
      path: 'cursosFavoritos',
      populate: {
        path: 'videos',
        model: 'Video',
      },
      populate: {
        path: 'instrutor',
        model: 'Instrutor',
      },
    })
    .populate({
      path: 'cursosInscritos',
      populate: {
        path: 'videos',
        model: 'Video',
      },
      populate: {
        path: 'instrutor',
        model: 'Instrutor',
      },
    })
    .populate({
      path: 'cursosConcluidos',
      populate: {
        path: 'videos',
        model: 'Video',
      },
      populate: {
        path: 'instrutor',
        model: 'Instrutor',
      },
    });

  try {
    if (estudante) {
      res.status(200);
      res.json(estudante);
    } else {
      res.status(404);
      throw new Error('Estudante não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Atualiza o perfil de um estudante
// @route   PUT /api/estudantes/perfil
// @access  Privado
export const updateEstudanteProfile = asyncHandler(async (req, res) => {
  const estudante = await Estudante.findById(req.userId);

  try {
    if (estudante) {
      estudante.nome = req.body.nome || estudante.nome;
      estudante.email = req.body.email || estudante.email;

      if (req.body.senha) {
        estudante.senha = await bcrypt.hash(req.body.senha, 10);
      }

      const updatedEstudante = await estudante.save();

      res.json({
        _id: updatedEstudante._id,
        nome: updatedEstudante.nome,
        email: updatedEstudante.email,
        isAdmin: updatedEstudante.isAdmin,
        token: generateUserToken(updatedEstudante._id),
      });
    } else {
      res.status(404);
      throw new Error('Estudante não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Retorna todos os estudantes
// @route   GET /api/estudantes
// @access  Privado/Admin
export const getEstudantes = asyncHandler(async (req, res) => {
  const estudantes = await Estudante.find({}).select('-senha');
  res.json(estudantes);
});

// @desc    Deleta um estudante
// @route   DELETE /api/estudantes/:id
// @access  Privado/Admin
export const deleteEstudante = asyncHandler(async (req, res) => {
  const estudante = await Estudante.findById(req.params.id);

  if (estudante) {
    await estudante.deleteOne();
    res.json({ message: 'Estudante removido' });
  } else {
    res.status(404);
    throw new Error('Estudante não encontrado');
  }
});
