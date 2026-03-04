import { Router } from "express";
import tokenCheck from "../middleware/tokenCheck.js";
import usersController from "./controllers/usersController.js";
import categoriesController from "./controllers/categoriesController.js";
import transactionsController from "./controllers/transactionsController.js";
import budgetsController from "./controllers/budgetsController.js";

const router = Router();

router.use(tokenCheck);

//User routes
router.get('/user', usersController.getProfile);
router.put('/user', usersController.updateProfile);

//Categories routes
router.get('/categories', categoriesController.getAllCategories);
router.post('/categories', categoriesController.createCategory);
router.put('/categories/:id', categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

//Transactions routes
router.get('/transactions', transactionsController.getTransactions);
router.post('/transactions', transactionsController.addTransaction);
router.get('/transactions/totals', transactionsController.getMonthlyTotals);
router.get('/transactions/breakdown', transactionsController.getExpenseBreakdown);
router.get('/transactions/trend', transactionsController.getSixMonthsTrend);
router.get('/transactions/mom', transactionsController.getMonthOverMonthComparison);
router.get('/transactions/top', transactionsController.getTopExpenses);
router.get('/transactions/recent', transactionsController.getRecentTransactions);
router.get('/transactions/average', transactionsController.getDailyAverage);
router.delete('/transactions/:id', transactionsController.deleteTransaction);

//Budget Routes
router.post('/budgets', budgetsController.createBudget);
router.get('/budgets', budgetsController.getMyBudgets);
router.get('/budgets/status', budgetsController.checkBudgetStatus);
router.put('/budgets/:id', budgetsController.modifyBudget);
router.delete('/budgets/:id', budgetsController.deleteBudget);

//Saving Goals Routes

export default router;