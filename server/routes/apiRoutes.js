import { Router } from "express";
import tokenCheck from "../middleware/tokenCheck.js";
import usersController from "./controllers/usersController.js";
import categoriesController from "./controllers/categoriesController.js";
import transactionsController from "./controllers/transactionsController.js";

const router = Router();

router.use(tokenCheck);

//User routes
router.get('/user', usersController.getProfile);
router.put('/user', usersController.updateProfile);

//Categories routes
router.get('/categories', categoriesController.getAllCategories);
router.post('/categories', categoriesController.createCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

//Transactions routes
router.get('/transactions', transactionsController.getTransactions);
router.post('/transactions', transactionsController.addTransaction);

export default router;