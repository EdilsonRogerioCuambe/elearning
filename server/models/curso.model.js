import { Schema, model } from 'mongoose';

const cursoSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
    maxlength: 350,
  },
  thumbnail: {
    type: String,
    required: true,
    trim: true,
  },
  preco: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 100,
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video',
    default: 0,
  }],
  estudantes: [{
    type: Schema.Types.ObjectId,
    ref: 'Estudante',
    default: 0,
  }],
  instrutor: {
    type: Schema.Types.ObjectId,
    ref: 'Instrutor',
    required: true,
  },
  avaliacoes: [{
    type: Schema.Types.ObjectId,
    ref: 'Avaliacao',
    default: 0,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default model('Curso', cursoSchema);