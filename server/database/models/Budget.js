import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

//Budget entity table configuration
class Budget extends Model{};

Budget.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    period: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'monthly',
        validate: {
            isIn: [['monthly', 'weekly', 'yearly']]
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //If this value is NULL it means the budget doesn't have any category assigned to it, so it becomes a global Budget
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Budget',
    tableName: 'Budgets',
    timestamps: true
});

export default Budget;