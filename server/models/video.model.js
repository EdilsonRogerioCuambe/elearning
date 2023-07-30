import { Schema, model } from "mongoose";

const videoSchema = new Schema({
  thumbnail: {
    type: String,
    required: true,
    trim: true,
  },
  curtidas: {
    type: Number,
    trim: true,
    default: 0,
  },
  curtidas: {
    type: Number,
    trim: true,
    default: 0,
  },
  usuariosCurtiram: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }],
  instrutor: {
    type: Schema.Types.ObjectId,
    ref: 'Instrutor',
    required: true,
  },
  video: {
    type: String,
    required: true,
    trim: true,
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
  },
  duracao: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  links: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
  comentarios: [{
    type: Schema.Types.ObjectId,
    ref: 'Comentario'
  }],
  curso: {
    type: Schema.Types.ObjectId,
    ref: 'Curso',
    required: true,
  },
  documentos: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assistido: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default model('Video', videoSchema);