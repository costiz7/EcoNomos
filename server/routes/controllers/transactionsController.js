import { Category, Transaction } from "../../database/associations.js";
import { Op } from "sequelize";

const getTransactions = async (req, res) => {
    try {
        const { month, year, categoryId, type } = req.query;

        const whereClause = {
            userId: req.user.id
        };

        const categoryInclude = {
            model: Category,
            attributes: ['name', 'iconFile', 'type']
        };

        if(month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            whereClause.date = {
                [Op.between]: [startDate, endDate]
            }
        };

        if(categoryId) {
            whereClause.categoryId = categoryId;
        }

        if(type) {
            categoryInclude.where = { type: type };
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [categoryInclude],
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const addTransaction = async (req, res) => {
    try {
        const { amount, date, description, categoryId } = req.body;

        if(!amount) {
            return res.status(400).json({ message: 'You have to input an amount' });
        }

        if(!categoryId) {
            return res.status(400).json({ message: 'You have to select a category' });
        }

        const category = await Category.findOne({
            where: {
                id: categoryId,
                [Op.or]: [
                    { userId: req.user.id },
                    { userId: null }
                ]
            }
        });

        if(!category) {
            return res.status(404).json({ message: 'This category does not exist' });
        }

        const newTransaction = await Transaction.create({
            amount,
            date,
            description,
            userId: req.user.id,
            categoryId
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!transaction) {
            return res.status(404).json({ message: "This transaction was not found or you can't delete it" });
        }

        await transaction.destroy();

        res.status(200).json({ message: "The transaction was successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getMonthlyTotals = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const transactions = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Category,
                    attributes: ['type']
                }
            ]
        });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            if(transaction.Category.type === 'income') {
                totalIncome += amount;
            } else if(transaction.Category.type === 'expense') {
                totalExpense += amount;
            }
        });

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            income: totalIncome,
            expense: totalExpense,
            balance: balance
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getExpenseBreakdown = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const expenses = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Category,
                    attributes: ['name', 'iconFile', 'type'],
                    where: { type: 'expense' }
                }
            ]
        });

        const breakdownObj = expenses.reduce((acc, transaction) => {
            const categoryName = transaction.Category.name;
            const categoryIcon = transaction.Category.iconFile;
            const amount = parseFloat(transaction.amount);

            if(!acc[categoryName]) {
                acc[categoryName] = {
                    category: categoryName,
                    icon: categoryIcon,
                    total: 0
                };
            }

            acc[categoryName].total += amount;

            return acc;
        }, {});

        const breakdownArray = Object.values(breakdownObj);
        breakdownArray.sort((a, b) => b.total - a.total);

        res.status(200).json(breakdownArray);
    } catch (error) {
        res.status(500).json({ message: "Can\'t generate graph.", error: error.message });
    }
}

const getSixMonthsTrend = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const trendData = [];
        for(let i = 5; i >= 0; i--) {
            const d = new Date(currentYear, currentMonth - i, 1);
            trendData.push({
                month: d.getMonth() + 1,
                year: d.getFullYear(),
                income: 0,
                expense: 0
            });
        }

        const startDate = new Date(currentYear, currentMonth - 5, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);

        const transactions = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Category,
                    attributes: ['type']
                }
            ]
        });

        transactions.forEach(transaction => {
            const tDate = new Date(transaction.date);
            const tMonth = tDate.getMonth() + 1;
            const tYear = tDate.getFullYear();
            const amount = parseFloat(transaction.amount);
            const type = transaction.Category.type;

            const monthBucket = trendData.find(m => m.month === tMonth && m.year === tYear);
            if(monthBucket) {
                if(type === 'income') {
                    monthBucket.income += amount;
                } else if (type === 'expense') {
                    monthBucket.expense += amount;
                }
            }
        });

        res.status(200).json(trendData);

    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve trending data', error: error.message });
    }
}

const getMonthOverMonthComparison = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const currentStartDate = new Date(targetYear, targetMonth - 1, 1);
        const currentEndDate = new Date(targetYear, targetMonth, 0);

        const prevStartDate = new Date(targetYear, targetMonth - 2, 1);
        const prevEndDate = new Date(targetYear, targetMonth - 1, 0);

        const currentTransactions = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [currentStartDate, currentEndDate]
                }
            },
            include: [{
                model: Category,
                where: { type: 'expense' },
                attributes: []
            }]
        });

        const prevTransactions = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [prevStartDate, prevEndDate]
                }
            },
            include: [{
                model: Category,
                where: { type: 'expense' },
                attributes: []
            }]
        });

        const currentExpense = currentTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const previousExpense = prevTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        let percentage = 0;
        let trend = 'flat';

        if(previousExpense === 0) {
            percentage = currentExpense > 0 ? 100 : 0;
        } else {
            percentage = ((currentExpense - previousExpense) / previousExpense) * 100;
        }

        percentage = Math.round(percentage * 100) / 100;

        if(percentage > 0) {
            trend = 'up';
        } else if(percentage < 0) {
            trend = 'down';
        }

        res.status(200).json({
            currentExpense,
            previousExpense,
            percentage,
            trend
        });

    } catch (error) {
        res.status(500).json({ message: 'Can not calculate comparisons', error: error.message });
    }
}

const getTopExpenses = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const topExpenses = await Transaction.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Category,
                    attributes: ['name', 'iconFile', 'type'],
                    where: { type: 'expense' }
                }
            ],
            order: [
                ['amount', 'DESC']
            ],
            limit: 5
        });

        res.status(200).json(topExpenses);

    } catch (error) {
        res.status(500).json({ message: "Can not generate top expenses", error: error.message });
    }
};

const getRecentTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
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
                ['date', 'DESC'],
                ['createdAt', 'DESC']
            ],
            limit: 5
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Could not obtain last transactions', error: error.message });
    }
}

export const getDailyAverage = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const targetMonth = month ? parseInt(month) : currentMonth;
        const targetYear = year ? parseInt(year) : currentYear;

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

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
                attributes: []
            }]
        });

        const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

        let daysToDivide;
        if (targetMonth === currentMonth && targetYear === currentYear) {
            daysToDivide = currentDate.getDate();
        } else {
            daysToDivide = endDate.getDate();
        }

        let dailyAverage = totalExpense / daysToDivide;
        dailyAverage = Math.round(dailyAverage * 100) / 100;

        res.status(200).json({ dailyAverage });

    } catch (error) {
        res.status(500).json({ message: "Can't calculate average", error: error.message });
    }
};

export default { 
    getTransactions, 
    addTransaction, 
    deleteTransaction, 
    getMonthlyTotals,
    getExpenseBreakdown,
    getSixMonthsTrend,
    getMonthOverMonthComparison,
    getTopExpenses,
    getRecentTransactions,
    getDailyAverage
 };