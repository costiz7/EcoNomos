import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

class SavingsGoal extends Model {};

SavingsGoal.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    targetAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'SavingsGoal',
    tableName: 'SavingsGoals',
    timestamps: true
});

export default SavingsGoal;