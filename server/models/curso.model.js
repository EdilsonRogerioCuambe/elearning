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

cursoSchema.statics.foiCompletamenteAssistido = async function (cursoId, estudanteId) {
  const curso = await this.findById(cursoId)
    .populate({
      path: 'videos',
      select: '_id',
    })
    .populate({
      path: 'estudantes',
      match: { _id: estudanteId },
      select: 'videosAssistidos',
    })
    .exec();

  if (!curso) {
    throw new Error('Curso não encontrado');
  }

  const videos = curso.videos.map(video => video._id.toString());
  const estudante = curso.estudantes[0];

  if (!estudante) {
    throw new Error('Estudante não encontrado');
  }

  const videosAssistidos = estudante.videosAssistidos.map(videoAssistido => videoAssistido.toString());

  return videos.every(video => videosAssistidos.includes(video));
};

export default model('Curso', cursoSchema);