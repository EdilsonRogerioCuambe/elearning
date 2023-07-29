import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Router } from 'express';
import { verifyUserToken, verifyInstrutor, verifyEstudante } from '../utils/auth.utils.js';
import {
  registrarCurso,
  atualizarCurso,
  deletarCurso,
  listarCursoPorId,
  listarCursos,
  inscreverEstudante,
  listarCursosInscritos,
  favoritarCurso,
  desfavoritarCurso,
  desinscreverCurso,
} from '../controllers/curso.controllers.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'cursos',
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 5MB
});

const router = Router();

router.get('/', listarCursos);
router.get('/:id', listarCursoPorId);
router.post('/', verifyUserToken, verifyInstrutor, parser.single('thumbnail'), registrarCurso);
router.put('/:id', verifyUserToken, verifyInstrutor, parser.single('thumbnail'), atualizarCurso);
router.delete('/:id', verifyUserToken, verifyInstrutor, deletarCurso);
router.post('/inscrever', verifyUserToken, verifyEstudante, inscreverEstudante);
router.get('/inscrito', verifyUserToken, verifyEstudante, listarCursosInscritos);
router.post('/favoritar', verifyUserToken, verifyEstudante, favoritarCurso);
router.post('/desfavoritar', verifyUserToken, verifyEstudante, desfavoritarCurso);
router.post('/desinscrever', verifyUserToken, verifyEstudante, desinscreverCurso);

export default router;