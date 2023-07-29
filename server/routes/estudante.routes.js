import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Router } from 'express';
import { verifyUserToken, verifyEstudante } from '../utils/auth.utils.js';
import { getEstudanteProfile, getEstudantes, registrarEstudante, autenticarEstudante, updateEstudanteProfile, deleteEstudante } from '../controllers/estudante.controllers.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'estudantes',
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

const router = Router();

router.get('/', verifyUserToken, verifyEstudante, getEstudantes);
router.get('/perfil', verifyUserToken, verifyEstudante, getEstudanteProfile);
router.post('/', parser.single('foto'), registrarEstudante);
router.post('/login', autenticarEstudante);
router.put('/perfil', verifyUserToken, verifyEstudante, parser.single('foto'), updateEstudanteProfile);
router.delete('/:id', verifyUserToken, verifyEstudante, deleteEstudante);

export default router;
