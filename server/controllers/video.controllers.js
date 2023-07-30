import Video from "../models/video.model.js";
import asyncHandler from "express-async-handler";
import Curso from "../models/curso.model.js";
import Comentario from "../models/comentario.model.js";
import Estudante from "../models/estudante.model.js";
import cloudinary from 'cloudinary';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import Instrutor from "../models/instrutor.model.js";

const __dirname = path.resolve();

const dirPath = path.join(__dirname, 'certificados');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gerar o certficado do usuário com todas as suas informações
const gerarCertificado = async (estudante, curso) => {
  const doc = new PDFDocument();

  const caminhoDoPdf = `./certificados/${estudante.nome}-${curso.nome}.pdf`;
  const stream = fs.createWriteStream(caminhoDoPdf);

  doc.pipe(stream);

  doc.fontSize(25).text(`Certificado de conclusão do curso ${curso.nome}`, {
    align: 'center',
  });
  doc.fontSize(15).text(`O estudante ${estudante.nome} concluiu o curso ${curso.nome} com sucesso!`, {
    align: 'center',
  });
  doc.fontSize(15).text(`Data de conclusão: ${new Date().toLocaleDateString()}`, {
    align: 'center',
  });
  doc.end();

  return caminhoDoPdf;
};

// @desc    Registra um novo video
// @route   POST /api/videos
// @access  Privado
export const registrarVideo = asyncHandler(async (req, res) => {
  const {
    descricao,
    duracao,
    titulo,
    curso,
    instrutor,
  } = req.body;

  const thumbnail = req.files.thumbnail[0].path; // Extract the path from thumbnail object

  const video = req.files.video[0].path; // Extract the path from video object

  const videoExiste = await Video.findOne({ titulo });

  if (videoExiste) {
    res.status(400);
    throw new Error("Video já existe");
  }

  try {
    const videoCriado = await Video.create({
      descricao,
      duracao,
      titulo,
      curso,
      video, // Save the video path
      instrutor,
      thumbnail,
    });

    const cursoEncontrado = await Curso.findById(curso);

    if (cursoEncontrado) {
      cursoEncontrado.videos.push(videoCriado._id);
      await cursoEncontrado.save();
    }

    if (video) {
      res.status(201).json(videoCriado);
    } else {
      res.status(400);
      throw new Error("Dados inválidos");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Retorna todos os videos
// @route   GET /api/videos
// @access  Privado
export const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({})
    .populate("curso");

  try {
    if (videos) {
      res.json(videos);
    } else {
      res.status(404);
      throw new Error("Nenhum video encontrado");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Retorna um video
// @route   GET /api/videos/:id
// @access  Privado
export const getVideo = asyncHandler(async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("curso")
      .populate("instrutor")

    if (!video) {
      res.status(404);
      throw new Error("Video não encontrado");
    }

    const comentariosEstudante = await Comentario.find({ video: video._id, tipoAutor: 'Estudante' })
      .populate({
        path: 'autor',
        model: 'Estudante'
      })
      .populate('respostas')
      .exec();

    const comentariosInstrutor = await Comentario.find({ video: video._id, tipoAutor: 'Instrutor' })
      .populate({
        path: 'autor',
        model: 'Instrutor'
      })
      .populate('respostas')
      .exec();

    video.comentarios = [...comentariosEstudante, ...comentariosInstrutor];

    // checar se o usuario é um instrutor
    const instrutor = await Instrutor.findById(req.userId);

    if (instrutor) {
      return res.json(video);
    }

    // Verificar se o estudante assistiu o video e marca como assistido
    const estudante = await Estudante.findById(req.userId);

    if (!estudante) {
      res.status(404);
      throw new Error("Estudante não encontrado");
    }

    console.log(video.curso._id.toString());

    const curso = await Curso.findById(video.curso._id.toString());

    if (!curso) {
      res.status(404);
      throw new Error("Curso não encontrado");
    }

    const videosAssistidos = estudante.videosAssistidos.find(videoAssistido => videoAssistido.toString() === video._id.toString());

    if (!videosAssistidos) {
      estudante.videosAssistidos.push(video._id);

      if (curso.videos.length === estudante.videosAssistidos.length) {
        estudante.cursosConcluidos.push(curso._id);
        await estudante.save();

        // Gerar o certificado do usuário
        const caminhoDoPdf = await gerarCertificado(estudante, curso);

        // Upload do certificado para o Cloudinary
        const certificado = await cloudinary.v2.uploader.upload(caminhoDoPdf, {
          folder: 'certificados',
          resource_type: 'auto',
          public_id: `${estudante.nome}-${curso.nome}`,
        });

        // Adicionar o certificado ao estudante
        estudante.certificados.push(certificado.url);
        await estudante.save();

        // Deletar o certificado do servidor
        fs.unlinkSync(caminhoDoPdf);
      } else {
        await estudante.save();
      }
    } else {
      video.assistido = true;
    }

    res.json(video);
  } catch (error) {
    console.log(error); // Imprima o erro para depuração
    res.status(400);
    throw new Error(error);
  }
});


// @desc    Atualiza um video
// @route   PUT /api/videos/:id
// @access  Privado
export const atualizarVideo = asyncHandler(async (req, res) => {
  const {
    curtidas,
    descricao,
    duracao,
    titulo,
    links,
    curso,
    documentos,
  } = req.body;

  try {
    const video = await Video.findById(req.params.id);

    if (video) {
      video.curtidas = curtidas;
      video.descricao = descricao;
      video.duracao = duracao;
      video.titulo = titulo;
      video.links = links;
      video.curso = curso;
      video.documentos = documentos;

      const videoAtualizado = await video.save();

      res.json({
        _id: videoAtualizado._id,
        curtidas: videoAtualizado.curtidas,
        descricao: videoAtualizado.descricao,
        duracao: videoAtualizado.duracao,
        titulo: videoAtualizado.titulo,
        links: videoAtualizado.links,
        curso: videoAtualizado.curso,
        documentos: videoAtualizado.documentos,
      });
    } else {
      res.status(404);
      throw new Error("Video não encontrado");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Deleta um video
// @route   DELETE /api/videos/:id
// @access  Privado
export const deletarVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  const curso = await Curso.findById(video.curso);

  if (curso) {
    curso.videos.pull(video._id);
    await curso.save();
  }

  const comentarios = await Comentario.find({ video: video._id });

  if (comentarios) {
    comentarios.forEach(async (comentario) => {
      await comentario.deleteOne();
    });
  }

  try {
    if (video) {
      await video.deleteOne();
      res.json({ message: "Video removido" });
    } else {
      res.status(404);
      throw new Error("Video não encontrado");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Curtir um video
// @route   PUT /api/videos/:id/curtir
// @access  Privado
export const curtirVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Video não encontrado");
  }

  // Verifica se o usuário já curtiu o vídeo
  if (video.usuariosCurtiram.includes(req.userId)) {
    res.status(400);
    throw new Error("Você já curtiu este vídeo");
  }

  video.curtidas += 1;
  video.usuariosCurtiram.push(req.userId);

  await video.save();

  res.json({
    message: "Video curtido",
    curtidas: video.curtidas,
    jaCurtido: true,
  });
});

// @desc    Descurtir um video
// @route   PUT /api/videos/:id/descurtir
// @access  Privado
export const descurtirVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Video não encontrado");
  }

  // Verifica se o usuário já curtiu o vídeo
  if (!video.usuariosCurtiram.includes(req.userId)) {
    res.status(400);
    throw new Error("Você ainda não curtiu este vídeo");
  }

  video.curtidas -= 1;
  video.usuariosCurtiram.pull(req.userId);

  await video.save();

  res.json({
    message: "Video descurtido",
    curtidas: video.curtidas,
    jaCurtido: false,
  });
});

// @desc    Adicionar um documento a um vídeo
// @route   POST /api/videos/:id/documentos
// @access  Privado
export const adicionarDocumento = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Video não encontrado");
  }

  try {
    const file = req.file;
    if (!file || !file.path) {
      res.status(400);
      throw new Error("Nenhum arquivo foi enviado");
    }
    video.documentos.push(file.path);
    const videoAtualizado = await video.save();

    res.json({
      documentos: videoAtualizado.documentos,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});


// @desc    Atualizar os links de um vídeo
// @route   PUT /api/videos/:id/links
// @access  Privado
export const adicionarLink = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  const { link } = req.body;

  if (!video) {
    res.status(404);
    throw new Error("Video não encontrado");
  }

  try {
    video.links.push(link);
    const videoAtualizado = await video.save();

    res.json({
      links: videoAtualizado.links,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});