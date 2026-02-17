import { Router } from "express";
import tokenCheck from "../middleware/tokenCheck.js";

const router = Router();

router.use(tokenCheck);



export default router;