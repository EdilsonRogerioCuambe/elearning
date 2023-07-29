import { Schema, model } from "mongoose";

const comentarioSchema = new Schema({
  conteudo: {
    type: String,
    required: true,
    trim: true,
  },
  autor: {
    type: Schema.Types.ObjectId, // Pode ser um estudante ou um instrutor
    refPath: 'tipoAutor',
    required: true,
  },
  tipoAutor: {
    type: String,
    required: true,
    enum: ['Instrutor', 'Estudante'],
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respostas: [{
    type: Schema.Types.ObjectId,
    ref: 'Comentario'
  }]
}, {
  timestamps: true,
});

export default model('Comentario', comentarioSchema);