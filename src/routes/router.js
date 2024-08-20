import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import autenticator from "../middlewares/autenticator.middlewere.js";

const router = Router();

router.post("/usuario/novaConta", usuarioController.create);

router.post("/usuario/login", usuarioController.login);

router.patch(
  "/usuario/novaSenha",
  autenticator.auth,
  usuarioController.updatePassword
);

router.post("/usuario/mostrarPerfil", usuarioController.showProfile);

export default router;
