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

export default { getTransactions, addTransaction };