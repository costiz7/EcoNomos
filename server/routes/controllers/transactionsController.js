import { Category, Transaction } from "../../database/associations.js";
import { Op } from "sequelize";

/**
 * Retrieves a list of transactions for the authenticated user with optional filtering.
 * 
 * The function fetches transactions from the database and allows filtering by 
 * a specific month and year, a specific category ID, or a transaction type 
 * (e.g., 'income' or 'expense'). The results are sorted by date and creation 
 * time in descending order.
 *
 * @async
 * @function getTransactions
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The URL query parameters for filtering.
 * @param {string|number} [req.query.month] - (Optional) The month to filter transactions by (1-12). Must be used with year.
 * @param {string|number} [req.query.year] - (Optional) The year to filter transactions by.
 * @param {string|number} [req.query.categoryId] - (Optional) The ID of a specific category to filter by.
 * @param {string} [req.query.type] - (Optional) The type of transaction to filter by (e.g., 'income' or 'expense').
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array of transaction objects that match the filters (status 200),
 *                            or a server error message if the query fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Creates a new transaction for the authenticated user.
 * 
 * The function validates that the required amount and category ID are provided. 
 * It then verifies that the selected category exists and is accessible to the user 
 * (either a custom user category or a global default category) before creating 
 * the transaction record in the database.
 *
 * @async
 * @function addTransaction
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing transaction details.
 * @param {number|string} req.body.amount - The monetary amount of the transaction.
 * @param {number|string} req.body.categoryId - The ID of the category associated with the transaction.
 * @param {string|Date} [req.body.date] - (Optional) The date of the transaction.
 * @param {string} [req.body.description] - (Optional) A brief description or note for the transaction.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the newly created transaction data (status 201),
 *                            an error message for missing fields (status 400) or invalid category (status 404),
 *                            or a server error message (status 500).
 */
const addTransaction = async (req, res) => {
    try {
        const { amount, date, description, categoryId } = req.body;

        if(!amount) {
            return res.status(400).json({ errorCode: 'MISSING_AMOUNT' });
        }

        if(!categoryId) {
            return res.status(400).json({ errorCode: 'MISSING_CATEGORY' });
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
            return res.status(404).json({ errorCode: 'CATEGORY_NOT_FOUND' });
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Deletes a specific transaction for the authenticated user.
 * 
 * The function looks for a transaction by its ID, ensuring that it belongs 
 * to the currently authenticated user. If the transaction is found, it is 
 * permanently removed from the database.
 *
 * @async
 * @function deleteTransaction
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {number|string} req.params.id - The ID of the transaction to be deleted.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with a success message (status 200),
 *                            an error message if the transaction is not found or unauthorized (status 404),
 *                            or a server error message (status 500).
 */
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
            return res.status(404).json({ errorCode: 'TRANSACTION_NOT_FOUND_OR_UNAUTHORIZED' });
        }

        await transaction.destroy();

        res.status(200).json({ message: "Transaction deleted successfully." });
    } catch (error) {
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
};

/**
 * Calculates the total income, total expenses, and net balance for a specific month.
 * 
 * The function determines the target month and year (defaulting to the current 
 * date if not provided), fetches all transactions for the authenticated user 
 * within that timeframe, and sums up the amounts based on the category type 
 * ('income' vs 'expense'). Finally, it calculates the overall balance.
 *
 * @async
 * @function getMonthlyTotals
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The URL query parameters for timeframe selection.
 * @param {string|number} [req.query.month] - (Optional) The target month (1-12). Defaults to the current month.
 * @param {string|number} [req.query.year] - (Optional) The target year. Defaults to the current year.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response containing the calculated `income`, `expense`, and `balance` (status 200),
 *                            or a server error message if the calculation fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Retrieves a breakdown of expenses by category for a specific month and year.
 * 
 * The function fetches all expense transactions for the authenticated user 
 * within the specified timeframe. It then groups these expenses by category, 
 * calculates the total amount spent per category, and returns the results 
 * sorted in descending order by the total amount spent.
 *
 * @async
 * @function getExpenseBreakdown
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The URL query parameters for timeframe selection.
 * @param {string|number} [req.query.month] - (Optional) The target month (1-12). Defaults to the current month.
 * @param {string|number} [req.query.year] - (Optional) The target year. Defaults to the current year.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array of categorized expense objects sorted by total spent (status 200),
 *                            or a server error message if the query fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Retrieves income and expense trends for the past six months.
 * 
 * The function generates a timeline covering the current month and the five 
 * preceding months. It fetches all transactions for the authenticated user 
 * within this period, categorizes them as income or expense, and aggregates 
 * the total amounts for each month.
 *
 * @async
 * @function getSixMonthsTrend
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array containing six objects (one for each month) 
 *                            with aggregated `income` and `expense` data (status 200),
 *                            or a server error message if the query fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Calculates a month-over-month comparison of the user's expenses.
 * 
 * The function determines the target month and the preceding month, fetches all 
 * expense transactions for both periods, and sums them up. It then calculates the 
 * percentage change between the two months and identifies the spending trend 
 * ('up', 'down', or 'flat').
 *
 * @async
 * @function getMonthOverMonthComparison
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The URL query parameters for timeframe selection.
 * @param {string|number} [req.query.month] - (Optional) The target month (1-12). Defaults to the current month.
 * @param {string|number} [req.query.year] - (Optional) The target year. Defaults to the current year.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response containing `currentExpense`, `previousExpense`, the percentage change, and the `trend` (status 200),
 *                            or a server error message if the query/calculation fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Retrieves the top 5 highest expenses for a specific month and year.
 * 
 * The function fetches expense transactions for the authenticated user within 
 * the specified timeframe (defaulting to the current month if not provided). 
 * It orders the transactions by amount in descending order and limits the 
 * result to the top 5 largest expenses.
 *
 * @async
 * @function getTopExpenses
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The URL query parameters for timeframe selection.
 * @param {string|number} [req.query.month] - (Optional) The target month (1-12). Defaults to the current month.
 * @param {string|number} [req.query.year] - (Optional) The target year. Defaults to the current year.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array containing up to 5 of the highest expense transaction objects (status 200),
 *                            or a server error message if the database query fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
};

/**
 * Retrieves the 5 most recent transactions for the authenticated user.
 * 
 * The function fetches the user's latest transactions from the database, 
 * including their associated category details. The results are sorted primarily 
 * by transaction date and secondarily by creation time in descending order, 
 * limiting the output to the 5 most recent entries.
 *
 * @async
 * @function getRecentTransactions
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array containing up to 5 of the most recent transaction objects (status 200),
 *                            or a server error message if the database query fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

/**
 * Calculates the user's daily spending average for a specific month and year.
 * 
 * The function determines the total expenses for the selected timeframe and divides 
 * them by the number of days elapsed. If the target is the current month, it divides 
 * by the current day of the month; otherwise, it divides by the total number of 
 * days in that month.
 *
 * @async
 * @function getDailyAverage
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The URL query parameters for timeframe selection.
 * @param {string|number} [req.query.month] - (Optional) The target month (1-12). Defaults to the current month.
 * @param {string|number} [req.query.year] - (Optional) The target year. Defaults to the current year.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the calculated `dailyAverage` (status 200),
 *                            or a server error message if the calculation fails (status 500).
 */
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
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
};

/**
 * Helper function to generate mock bank transactions for the last 6 months.
 * It iterates through every single day of the past 6 months and generates 
 * between 1 and 3 random transactions per day using a predefined list of merchants.
 * * @returns {Array} An array of raw transaction objects sorted by date (newest first).
 */
const generateMockBankData = () => {
    const merchants = [
        'Lidl', 'Kaufland', 'Mega Image', 'Carrefour', 'Auchan',
        'Uber', 'Bolt', 'OMV', 'Petrom', 'Rompetrol',
        'Netflix', 'Spotify', 'Cinema City', 'Steam',
        'E.ON', 'Enel', 'Digi', 'Vodafone', 'Orange',
        'Zara', 'H&M', 'Nike', 'Emag', 'Altex',
        'KFC', 'McDonalds', 'Starbucks', 'Glovo', 'Tazz'
    ];

    const transactions = [];
    const endDate = new Date();
    const startDate = new Date();
    
    // Go back exactly 6 months from today
    startDate.setMonth(startDate.getMonth() - 6);

    // Loop through every single day from startDate to endDate
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        
        // Generate between 1 and 3 transactions for the current day in the loop
        const transactionsToday = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < transactionsToday; i++) {
            // Pick a random merchant from the list
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            
            // Generate a random amount between 15.00 and 450.00
            const amount = (Math.random() * (450 - 15) + 15).toFixed(2);
            
            // Set a random time (hour and minute) for the transaction
            const txDate = new Date(d);
            txDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            // Push the generated transaction to our array
            transactions.push({
                description: merchant,
                amount: parseFloat(amount),
                date: txDate,
                source: 'bank' // Flag indicating this came from the "bank API"
            });
        }
    }

    // Return the array sorted descending (newest transactions first)
    return transactions.sort((a, b) => b.date - a.date);
};

/**
 * Controller endpoint to handle the simulation of importing bank transactions.
 * It verifies if the user has already imported data to prevent duplicates, 
 * generates the mock data, and (temporarily) returns it as a JSON response.
 * * @async
 * @function importBankTransactions
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the generated transactions or an error code.
 */
const importBankTransactions = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        // Check if the user already triggered the bank import in the past
        if (user.hasImportedBankData) {
            return res.status(400).json({ errorCode: 'ALREADY_IMPORTED' });
        }

        // Generate the raw list of transactions using our helper function
        const rawTransactions = generateMockBankData();

        // TODO: Send 'rawTransactions' to Gemini AI for automatic categorization
        // TODO: Save the categorized transactions to the database
        // TODO: Update user.hasImportedBankData to true

        // Temporarily return the data to the frontend to verify the generator works
        res.status(200).json({
            message: "Bank data generated successfully.",
            count: rawTransactions.length,
            transactions: rawTransactions
        });

    } catch (error) {
        console.error("Error at importBankTransactions:", error);
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
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
    getDailyAverage,
    importBankTransactions
 };