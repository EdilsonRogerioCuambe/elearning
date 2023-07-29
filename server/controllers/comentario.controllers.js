import Comentario from '../models/comentario.model.js'
import asyncHandler from 'express-async-handler'
import Video from '../models/video.model.js'
import Instrutor from '../models/instrutor.model.js'
import Estudante from '../models/estudante.model.js'

// @desc    Registra um novo comentário
// @route   POST /api/comentarios
// @access  Privado
export const registrarComentario = asyncHandler(async (req, res) => {
  const { conteudo, autor, video, tipoAutor } = req.body

  try {
    const comentario = await Comentario.create({
      conteudo,
      autor,
      video,
      tipoAutor,
    })

    const videoEncontrado = await Video.findById(video)

    if (videoEncontrado) {
      videoEncontrado.comentarios.push(comentario._id)
      await videoEncontrado.save()
    }

    if (comentario) {
      res.json({
        message: 'Comentário registrado com sucesso',
        comentario,
      })
    } else {
      res.status(400)
      throw new Error('Dados inválidos')
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
});

// @desc    Registra uma resposta a um comentário existente
// @route   POST /api/comentarios/:id/responder
// @access  Privado
export const responderComentario = asyncHandler(async (req, res) => {
  const { conteudo, autor, tipoAutor, video } = req.body;

  const comentarioResposta = await Comentario.findById(req.params.id);

  if (comentarioResposta) {
    const resposta = new Comentario({
      conteudo,
      autor,
      tipoAutor,
      video // O video da resposta deve ser o mesmo do comentário original
    });

    const comentarioAtualizado = await Comentario.findByIdAndUpdate(
      req.params.id,
      {
        $push: { respostas: resposta._id },
      },
      { new: true }
    );

    res.json({
      message: 'Resposta registrada com sucesso',
      comentario: comentarioAtualizado,
    });
  } else {
    res.status(400);
    throw new Error('Comentário não encontrado');
  }
});


// @desc    Lista todos os comentários do video vendo o tipo do autor e refrenciando ao seu modelo correto
// @route   GET /api/comentarios/video/:id
// @access  Público
export const listarComentarios = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id)

  try {
    if (video) {
      const comentarios = await Comentario.find({ video: video._id })
      .populate('autor')

      res.json(comentarios)
    } else {
      res.status(400)
      throw new Error('Video não encontrado')
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Lista um comentário
// @route   GET /api/comentarios/:id
// @access  Público
export const listarComentario = asyncHandler(async (req, res) => {
  const comentario = await Comentario.findById(req.params.id).populate('autor');

  try {
    if (comentario) {
      res.json(comentario)
    } else {
      res.status(400)
      throw new Error('Comentário não encontrado')
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Atualiza um comentário
// @route   PUT /api/comentarios/:id
// @access  Privado
export const atualizarComentario = asyncHandler(async (req, res) => {
  const comentario = await Comentario.findById(req.params.id)



  if (comentario) {
    comentario.conteudo = req.body.conteudo || comentario.conteudo

    const comentarioAtualizado = await comentario.save()

    res.json({
      message: 'Comentário atualizado com sucesso',
      comentario: comentarioAtualizado,
    })
  } else {
    res.status(400)
    throw new Error('Comentário não encontrado')
  }
})

// @desc    Deleta um comentário
// @route   DELETE /api/comentarios/:id
// @access  Privado
export const deletarComentario = asyncHandler(async (req, res) => {
  const {idVideo, id} = req.params;

  const comentario = await Comentario.findById(id);

  if (comentario) {
    const video = await Video.findById(idVideo);

    if (video) { // Se o video existir, remove o id do comentario do array de comentarios do video
      video.comentarios = video.comentarios.filter(
        (comentario) => comentario._id.toString() !== id
      );

      await video.save();
    }

    await comentario.deleteOne();

    res.json({ message: 'Comentário deletado com sucesso' });
  } else {
    res.status(400);
    throw new Error('Comentário não encontrado');
  }
})





