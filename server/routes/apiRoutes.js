import { Router } from "express";
import tokenCheck from "../middleware/tokenCheck.js";
import usersController from "./controllers/usersController.js";
import categoriesController from "./controllers/categoriesController.js";

const router = Router();

router.use(tokenCheck);

//User routes
router.get('/user', usersController.getProfile);
router.put('/user', usersController.updateProfile);

//Categories routes
router.get('/categories', categoriesController.getAllCategories);
router.post('/categories', categoriesController.createCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

export default router;