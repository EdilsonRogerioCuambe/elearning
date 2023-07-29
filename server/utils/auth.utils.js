import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import Estudante from '../models/estudante.model.js';
import Instrutor from '../models/instrutor.model.js';
import Admin from '../models/admin.model.js';

// Gera um token para um usuário
export const generateUserToken = async (userModel, req, res) => {
  const { email, senha } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(senha, user.senha))) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        nome: user.nome,
        isAdmin: user.isAdmin,
        foto: user.foto,
        sexo: user.sexo,
        dataNascimento: user.dataNascimento,
        cpf: user.cpf,
        endereco: user.endereco,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    res.json({ message: `Usuário ${user.nome} autenticado com sucesso`, token });
  } else {
    res.status(401);
    throw new Error('Credenciais inválidas');
  }
}

// Verifica um token
export const verifyUserToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id;
      req.userEmail = decoded.email;
      req.userNome = decoded.nome;
      req.userIsAdmin = decoded.isAdmin;
      req.userFoto = decoded.foto;
       next();
    } catch (error) {
      console.error(error);
      res.status(403);
      throw new Error('Não autorizado, token inválido ou expirado');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Não autorizado, token não encontrado');
  }
};


// Verifica se o usuário é um estudante
export const verifyEstudante = asyncHandler(async (req, res, next) => {
  const estudante = await Estudante.findById(req.userId);

  if (estudante) {
    next();
  } else {
    res.status(401);
    throw new Error('Não autorizado como estudante');
  }
});

// Verifica se o usuário é um instrutor
export const verifyInstrutor = asyncHandler(async (req, res, next) => {
  const instrutor = await Instrutor.findById(req.userId);

  if (instrutor) {
    next();
  } else {
    res.status(401);
    throw new Error('Não autorizado como instrutor');
  }
});

// Verifica se o usuário é um admin
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.userId);

  if (admin) {
    next();
  } else {
    res.status(401);
    throw new Error('Não autorizado como admin');
  }
});
