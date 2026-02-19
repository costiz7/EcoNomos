import { Category, Transaction } from "../../database/associations";
import { Op } from "sequelize";

const getTransactions = async (req, res) => {
    try {
        const { month, year, categoryId, type } = req.query;

        const whereClause = {
            userId: req.user.id
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

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    attributes: ['name', 'iconFile', 'type'],
                    where: type ? { type } : undefined
                }
            ],
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default { getTransactions };