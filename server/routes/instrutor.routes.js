import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Router } from "express";
import {
  verifyUserToken,
  verifyInstrutor,
} from "../utils/auth.utils.js";

import {
  registrarInstrutor,
  autenticarInstrutor,
  getInstrutores,
  getPerfilInstrutor,
  atualizarPerfilInstrutor,
  getInstrutorById,
  deletarInstrutor,
} from "../controllers/instrutor.controllers.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "instrutores",
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 5MB
});

const router = Router();

router.get("/", verifyUserToken, getInstrutores);
router.get("/perfil", verifyUserToken, verifyInstrutor, getPerfilInstrutor);
router.post("/", parser.single("foto"), registrarInstrutor);
router.post("/login", autenticarInstrutor);
router.put(
  "/perfil",
  verifyUserToken,
  verifyInstrutor,
  parser.single("foto"),
  atualizarPerfilInstrutor
);
router.get("/:id", verifyUserToken, verifyInstrutor, getInstrutorById);
router.delete("/:id", verifyUserToken, verifyInstrutor, deletarInstrutor);

export default router;