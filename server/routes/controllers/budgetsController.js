import { Budget, Category } from "../../database/associations.js";
import { Op } from "sequelize";

const createBudget = async (req, res) => {
    try {
        const { amount, period, categoryId } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'You have to input an amount.' });
        }

        if (!categoryId) {
            return res.status(400).json({ message: 'You have to select a category.' });
        }

        const existingBudget = await Budget.findOne({
            where: {
                userId: req.user.id,
                categoryId: categoryId,
                period: period || 'monthly'
            }
        });

        if (existingBudget) {
            return res.status(400).json({ message: 'This budget already exists for this period' });
        }

        const newBudget = await Budget.create({
            amount,
            period: period || 'monthly',
            categoryId,
            userId: req.user.id
        });

        
        res.status(201).json(newBudget);

    } catch (error) {
        res.status(500).json({ message: 'Could not create budget', error: error.message });
    }
};

const modifyBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, period } = req.body;

        const budget = await Budget.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!budget) {
            return res.status(404).json({ message: 'Could not modify or find this budget.' });
        }

        if (amount) budget.amount = amount;
        if (period) budget.period = period;

        await budget.save();

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Could not modify this budget', error: error.message });
    }
}

const getMyBudgets = async (req, res) => {
    try {
        const budgets = await Budget.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: Category,
                    attributes: ['name', 'iconFile', 'type']
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });

        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve budgets', error: error.message });
    }
}

const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const budget = await Budget.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!budget) {
            return res.status(404).json({ message: 'Could not find budget or you are not authorized to delete it.' });
        }

        await budget.destroy();

        res.status(200).json({ message: 'The budget was successfully deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Could not delete budget', error: error.message });
    }
}

const checkBudgetStatus = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const budgets = await Budget.findAll({
            where: { 
                userId: req.user.id 
            },
            include: [{ 
                model: Category, 
                attributes: ['name', 'iconFile', 'type'] 
            }]
        });

        if (!budgets.length) {
            return res.status(200).json([]);
        }

        const expenses = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: { 
                    [Op.between]: [startDate, endDate] 
                }
            },
            include: [{
                model: Category,
                where: { type: 'expense' },
                attributes: ['id']
            }]
        });

        const expensesByCategory = expenses.reduce((acc, transaction) => {
            const catId = transaction.categoryId;
            const amount = parseFloat(transaction.amount);
            
            if (!acc[catId]) acc[catId] = 0;
            acc[catId] += amount;
            
            return acc;
        }, {});

        const budgetStatuses = budgets.map(budget => {
            const limit = parseFloat(budget.amount);
            const spent = expensesByCategory[budget.categoryId] || 0; 
            const remaining = limit - spent;

            let percentage = (spent / limit) * 100;
            percentage = Math.round(percentage * 100) / 100;

            let status = 'safe';
            if (spent === 0) {
                status = 'untouched';
            } else if (percentage >= 100) {
                status = 'exceeded';
            } else if (percentage >= 80) {
                status = 'warning';
            }

            return {
                budgetId: budget.id,
                categoryId: budget.categoryId,
                categoryName: budget.Category.name,
                categoryIcon: budget.Category.iconFile,
                period: budget.period,
                limit: limit,
                spent: spent,
                remaining: remaining < 0 ? 0 : remaining,
                percentage: percentage,
                status: status
            };
        });

        res.status(200).json(budgetStatuses);

    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve budget status', error: error.message });
    }
}

export default {
    createBudget,
    modifyBudget,
    getMyBudgets,
    deleteBudget,
    checkBudgetStatus
}