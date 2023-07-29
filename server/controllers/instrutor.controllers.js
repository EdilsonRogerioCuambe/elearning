import Instrutor from '../models/instrutor.model.js';
import asyncHandler from 'express-async-handler';
import { generateUserToken } from '../utils/auth.utils.js';
import bcrypt from 'bcrypt';

// @desc    Registra um novo instrutor
// @route   POST /api/instrutores
// @access  Público
export const registrarInstrutor = asyncHandler(async (req, res) => {
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

  const instrutorExiste = await Instrutor.findOne({ email });

  if (instrutorExiste) {
    res.status(400);
    throw new Error('Instrutor já existe');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const instrutor = await Instrutor.create({
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

    if (instrutor) {
      generateUserToken(Instrutor, req, res);
    } else {
      res.status(400);
      throw new Error('Dados inválidos');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Autentica um instrutor
// @route   POST /api/instrutores/login
// @access  Público
export const autenticarInstrutor = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const instrutor = await Instrutor.findOne({ email });

  if (!instrutor) {
    res.status(404);
    throw new Error('Instrutor não encontrado');
  }

  try {
    const senhaCorreta = await bcrypt.compare(senha, instrutor.senha);

    if (senhaCorreta) {
      generateUserToken(Instrutor, req, res);
    } else {
      res.status(400);
      throw new Error('Credenciais inválidas');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Retorna o perfil de um instrutor  
// @route   GET /api/instrutores/perfil
// @access  Privado
export const getPerfilInstrutor = asyncHandler(async (req, res) => {
  const instrutor = await Instrutor.findById(req.userId).select('-senha').populate('cursos');

  try {
    if (instrutor) {
      return res.json(instrutor);
    } else {
      res.status(404);
      throw new Error('Instrutor não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Pega todos os instrutores
// @route   GET /api/instrutores
// @access  Privado/Admin
export const getInstrutores = asyncHandler(async (req, res) => {
  const instrutores = await Instrutor.find({})
    .select('-senha')
    .populate('cursos')

  res.json(instrutores);
})

// @desc    Pega um instrutor pelo ID
// @route   GET /api/instrutores/:id
// @access  Privado/Admin
export const getInstrutorById = asyncHandler(async (req, res) => {
  const instrutor = await Instrutor.findById(req.params.id)
    .select('-senha')
    .populate('cursos');

  try {
    if (instrutor) {
      return res.json(instrutor);
    } else {
      res.status(404);
      throw new Error('Instrutor não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Atualiza o perfil de um instrutor
// @route   PUT /api/instrutores/perfil
// @access  Privado
export const atualizarPerfilInstrutor = asyncHandler(async (req, res) => {
  const instrutor = await Instrutor.findById(req.userId);

  if (instrutor) {
    instrutor.nome = req.body.nome || instrutor.nome;
    instrutor.email = req.body.email || instrutor.email;
    instrutor.endereco = req.body.endereco || instrutor.endereco;
    instrutor.telefone = req.body.telefone || instrutor.telefone;
    instrutor.dataNascimento = req.body.dataNascimento || instrutor.dataNascimento;
    instrutor.cpf = req.body.cpf || instrutor.cpf;
    instrutor.sexo = req.body.sexo || instrutor.sexo;
    instrutor.foto = req.body.foto || instrutor.foto;

    if (req.body.senha) {
      instrutor.senha = req.body.senha;
    }

    await instrutor.save();

    generateUserToken(Instrutor, req, res);
  } else {
    res.status(404);
    throw new Error('Instrutor não encontrado');
  }
});

// @desc    Deleta um instrutor
// @route   DELETE /api/instrutores/:id
// @access  Privado/Admin
export const deletarInstrutor = asyncHandler(async (req, res) => {
  const instrutor = await Instrutor.findById(req.params.id);

  if (instrutor) {
    await instrutor.remove();
    res.json({ message: 'Instrutor removido' });
  } else {
    res.status(404);
    throw new Error('Instrutor não encontrado');
  }
});
