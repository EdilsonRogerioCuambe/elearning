import Cursos from '../models/curso.model.js';
import asyncHandler from 'express-async-handler';
import Instrutor from '../models/instrutor.model.js';
import Estudante from '../models/estudante.model.js';
import Video from '../models/video.model.js';
import stripe from 'stripe';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Registra um novo curso
// @route   POST /api/cursos
// @access  Privado
export const registrarCurso = asyncHandler(async (req, res) => {
  const {
    nome,
    descricao,
    preco,
    categoria,
    instrutor,
  } = req.body;

  const thumbnail = req.file.path;

  try {
    const curso = await Cursos.create({
      nome,
      descricao,
      thumbnail,
      preco,
      categoria,
      instrutor,
    });

    const instrutorEncontrado = await Instrutor.findById(instrutor);

    if (instrutorEncontrado) {
      instrutorEncontrado.cursos.push(curso._id);
      await instrutorEncontrado.save();
    }

    if (curso) {
      return res.json({
        message: 'Curso registrado com sucesso',
        curso,
      });
    } else {
      res.status(400);
      throw new Error('Dados inválidos');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Lista todos os cursos
// @route   GET /api/cursos
// @access  Público
export const listarCursos = asyncHandler(async (req, res) => {
  const cursos = await Cursos.find({}).populate('instrutor', 'nome foto');

  try {
    if (cursos) {
      res.json(cursos);
    } else {
      res.status(404);
      throw new Error('Cursos não encontrados');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Lista um curso pelo ID
// @route   GET /api/cursos/:id
// @access  Público
export const listarCursoPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const curso = await Cursos.findById(id)
    .populate('instrutor', '_id nome foto tipoUsuario')
    .populate('videos', '_id titulo thumbnail descricao')

  if (!curso) {
    res.status(404);
    throw new Error('Curso não encontrado');
  }

  try {
    res.json(curso);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Atualiza um curso
// @route   PUT /api/cursos/:id
// @access  Privado
export const atualizarCurso = asyncHandler(async (req, res) => {
  const {
    nome,
    descricao,
    thumbnail,
    preco,
    categoria,
  } = req.body;

  try {
    const curso = await Cursos.findById(req.params.id);

    if (curso) {
      curso.nome = nome;
      curso.descricao = descricao;
      curso.thumbnail = thumbnail;
      curso.preco = preco;
      curso.categoria = categoria;

      const cursoAtualizado = await curso.save();

      res.json({
        _id: cursoAtualizado._id,
        nome: cursoAtualizado.nome,
        descricao: cursoAtualizado.descricao,
        thumbnail: cursoAtualizado.thumbnail,
        preco: cursoAtualizado.preco,
        categoria: cursoAtualizado.categoria,
        instrutor: cursoAtualizado.instrutor,
      });
    } else {
      res.status(404);
      throw new Error('Curso não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Deleta um curso
// @route   DELETE /api/cursos/:id
// @access  Privado
export const deletarCurso = asyncHandler(async (req, res) => {
  const curso = await Cursos.findById(req.params.id);

  try {
    if (curso) {
      await curso.deleteOne()
      res.json({ message: 'Curso removido' });
    } else {
      res.status(404);
      throw new Error('Curso não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc Inscrever um estudante no curso
// @route POST /api/cursos/inscrever
// @access Privado
export const inscreverEstudante = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso || !estudante) {
      res.status(400);
      throw new Error('Curso ou estudante não encontrado');
    }

    // Verifica se o estudante já está inscrito no curso
    if (curso.estudantes.includes(estudante._id)) {
      res.status(400);
      throw new Error('Estudante já está inscrito no curso');
    }

    // Verifica se o curso já está na lista de cursos inscritos do estudante
    if (estudante.cursosInscritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso já está na lista de cursos inscritos do estudante');
    }

    const stripeSession = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: curso.nome,
              description: curso.descricao,
              images: [curso.thumbnail],
            },
            unit_amount: curso.preco * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: estudante.email,
      success_url: `${process.env.CLIENT_URL}/curso/${curso._id}`,
      cancel_url: `${process.env.CLIENT_URL}/`,
      client_reference_id: curso._id,
    });

    if (stripeSession.success_url) {
      curso.estudantes = curso.estudantes || [];
      estudante.cursos = estudante.cursos || [];

      curso.estudantes.push(estudante._id);
      estudante.cursosInscritos.push(curso._id);

      await curso.save();
      await estudante.save();

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'edilson@aluno.unilab.edu.br',
          pass: '@minhasenha2001'
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: estudante.email,
        subject: `Inscrição no curso ${curso.nome}`,
        html: `
          <html>
            <head>
              <style>
                /* Your existing styles... */
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }

                .header {
                  background-color: #f1f1f1;
                  padding: 20px;
                  text-align: center;
                }

                .header h2 {
                  margin: 0;
                }

                .content {
                  padding: 20px;
                }

                .footer {
                  background-color: #f1f1f1;
                  padding: 10px;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Inscrição no curso ${curso.nome}</h2>
                </div>
                <div class="content">
                  <p>Olá ${estudante.nome},</p>
                  <p>Você se inscreveu no curso "${curso.nome}" com sucesso!</p>
                  <p>Detalhes do curso:</p>
                  <p><strong>Nome do curso:</strong> ${curso.nome}</p>
                  <p><strong>Descrição:</strong> ${curso.descricao}</p>
                  <p><strong>Preço:</strong> R$ ${curso.preco}</p>
                  <img src="${curso.thumbnail}" alt="Thumbnail do curso ${curso.nome}" width="200" />
                  <p>Acesse o curso através do link: <a href="${process.env.CLIENT_URL}/curso/${curso._id}">${process.env.CLIENT_URL}/curso/${curso._id}</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email enviado: ${info.response}`);
        }
      });

    } else {
      res.status(400);
      throw new Error('Pagamento não realizado');
    }

    res.json({ stripeSession });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Lista os cursos inscritos pelo estudante
// @route   GET /api/cursos/inscricoes
// @access  Privado
export const listarCursosInscritos = asyncHandler(async (req, res) => {
  const estudante = await Estudante.findById(req.estudante._id).populate('cursos');

  try {
    if (estudante) {
      res.json(estudante.cursos);
    } else {
      res.status(404);
      throw new Error('Estudante não encontrado');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Favoritar um curso
// @route   POST /api/cursos/favoritar
// @access  Privado
export const favoritarCurso = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso || !estudante) {
      res.status(400);
      throw new Error('Curso ou estudante não encontrado');
    }

    // Verifica se o curso já está na lista de favoritos
    if (estudante.cursosFavoritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso já favoritado');
    }

    estudante.cursosFavoritos.push(curso._id);
    await estudante.save();

    res.json({ message: 'Curso favoritado com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Se desinscrever de um curso
// @route   DELETE /api/cursos/desinscrever
// @access  Privado
export const desinscreverCurso = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso) {
      res.status(400);
      throw new Error('Curso não encontrado');
    }

    if (!estudante) {
      res.status(400);
      throw new Error('Estudante não encontrado');
    }

    // Verifica se o estudante está inscrito no curso
    if (!curso.estudantes.includes(estudante._id)) {
      res.status(400);
      throw new Error('Estudante não está inscrito no curso');
    }

    // Verifica se o curso está na lista de cursos inscritos do estudante
    if (!estudante.cursosInscritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso não está na lista de cursos inscritos do estudante');
    }

    // Remove o curso da lista de cursos inscritos do estudante
    estudante.cursosInscritos.pull(curso._id);
    curso.estudantes.pull(estudante._id);
    await curso.save();
    await estudante.save();

    res.json({ message: 'Estudante desinscrito com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Desfavoritar um curso
// @route   DELETE /api/cursos/favoritar
// @access  Privado
export const desfavoritarCurso = asyncHandler(async (req, res) => {
  const { cursoId, estudanteId } = req.body;

  try {
    const curso = await Cursos.findById(cursoId);
    const estudante = await Estudante.findById(estudanteId);

    if (!curso || !estudante) {
      res.status(400);
      throw new Error('Curso ou estudante não encontrado');
    }

    // Verifica se o curso está na lista de favoritos
    if (!estudante.cursosFavoritos.includes(curso._id)) {
      res.status(400);
      throw new Error('Curso não está favoritado');
    }

    estudante.cursosFavoritos.pull(curso._id);
    await estudante.save();

    res.json({ message: 'Curso desfavoritado com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Gerar o certifcado em pdf caso o estudante tenha assistido todos os vídeos do curso
// @route   GET /api/cursos/:id/certificado
// @access  Privado
export const gerarCertificado = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const curso = await Cursos.findById(id).populate('videos');

  if (!curso) {
    res.status(404);
    throw new Error('Curso não encontrado');
  }

  const estudante = await Estudante.findById(req.userId);

  if (!estudante) {
    res.status(404);
    throw new Error('Estudante não encontrado');
  }

  const videosAssistidos = await Video.find({ curso: curso._id, usuariosCurtiram: estudante._id });

  if (videosAssistidos.length !== curso.videos.length) {
    res.status(400);
    throw new Error('Estudante não assistiu todos os vídeos do curso');
  }

  try {
    res.json({ message: 'Certificado gerado com sucesso' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});