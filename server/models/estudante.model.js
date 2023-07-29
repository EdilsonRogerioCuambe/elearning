import { Schema, model } from "mongoose";

const comentarioSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  endereco: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  telefone: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  senha: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  dataNascimento: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  foto: {
    type: String,
    required: true,
    trim: true,
  },
  tipoUsuario: {
    default: 'Estudante',
    type: String,
    trim: true,
    maxlength: 100,
    enum: ['Estudante', 'Instrutor']
  },
  cpf: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  cursosInscritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  }],
  cursosConcluidos: [{
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  }],
  certificados: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
  cursosFavoritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  }],
  sexo: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default model('Estudante', comentarioSchema);