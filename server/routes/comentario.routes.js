import { registrarComentario, listarComentario, listarComentarios, deletarComentario, responderComentario, atualizarComentario } from "../controllers/comentario.controllers.js";
import { verifyUserToken, verifyInstrutor, verifyEstudante } from "../utils/auth.utils.js";
import { Router } from "express";

const router = Router();

router.post('/', verifyUserToken, registrarComentario)
router.get('/video/:id', listarComentarios)
router.get('/:id', listarComentario)
router.delete('/:id/video/:idVideo', verifyUserToken, deletarComentario)
router.put('/:id/video/:idVideo', verifyUserToken, atualizarComentario)
router.post('/:id/responder', verifyUserToken, responderComentario)


export default router