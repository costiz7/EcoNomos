import { Router } from "express";
import { register, login } from "./controllers/authController.js";

//This router 'routes' all auth requests (login and register)
const router = Router();

router.post('/login', login);
router.post('/register', register);

export default router;