import { Router } from "express";
import tokenCheck from "../middleware/tokenCheck.js";
import usersController from "./controllers/usersController.js";

const router = Router();

router.use(tokenCheck);

//User routes
router.get('/user', usersController.getProfile);
router.put('/user', usersController.updateProfile);

export default router;