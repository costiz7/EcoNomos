import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

//Transaction entity table configuration
class Transaction extends Model {};

Transaction.init({
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
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    source: {
        type: DataTypes.ENUM('manual', 'bank'),
        allowNull: false,
        defaultValue: 'manual'
    }
}, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transaction',
    timestamps: true
});

export default Transaction;