import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Router } from 'express';
import { registrarVideo, getVideo, getVideos, atualizarVideo, deletarVideo, curtirVideo, descurtirVideo, adicionarDocumento, adicionarLink } from '../controllers/video.controllers.js';
import { verifyUserToken, verifyInstrutor, } from '../utils/auth.utils.js';
import path from 'path';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    let resourceType;
    if (file.fieldname === 'video') {
      resourceType = 'video';
    } else if (file.fieldname === 'thumbnail') {
      resourceType = 'image';
    }
    return {
      folder: 'videos',
      resource_type: resourceType,
      public_id: file.originalname,
    }
  },
});

const parser = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 200 }, // 200MB
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const docStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'documentos',
    resource_type: 'auto',
    public_id: (req, file) => {
      // Remove a extensão do arquivo
      const filename = file.originalname.replace(path.extname(file.originalname), '');
      return filename;
    },
  },
});

// Cria um novo parser para documentos
const docParser = multer({ storage: docStorage });

const router = Router();

router.post('/', verifyUserToken, verifyInstrutor, parser, registrarVideo);
router.get('/', verifyUserToken, getVideos);
router.get('/:id', verifyUserToken, getVideo);
router.put('/:id', verifyUserToken, verifyInstrutor, atualizarVideo);
router.delete('/:id', verifyUserToken, verifyInstrutor, deletarVideo);
router.put('/:id/curtir', verifyUserToken, curtirVideo);
router.put('/:id/descurtir', verifyUserToken, descurtirVideo);

// Use docParser.single('documento') para o upload de documentos
router.post('/:id/documentos', verifyUserToken, verifyInstrutor, docParser.single('documento'), adicionarDocumento);

// Não é necessário um parser para links
router.put('/:id/links', verifyUserToken, verifyInstrutor, adicionarLink);

export default router;