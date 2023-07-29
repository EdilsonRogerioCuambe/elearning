import { Schema, model } from "mongoose";

const instrutorSchema = new Schema({
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
    type: Number,
    required: true,
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
  cpf: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  cursos: [{
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  }],
  sexo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    enum: ['Masculino', 'Feminino']
  },
  comentarios: [{
    type: Schema.Types.ObjectId,
    ref: 'Comentario'
  }],
  tipoUsuario: {
    default: 'Instrutor',
    type: String,
    trim: true,
    maxlength: 100,
    enum: ['Estudante', 'Instrutor']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default model('Instrutor', instrutorSchema);