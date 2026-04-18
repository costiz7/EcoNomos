import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

//User entity table configuration
class User extends Model {};

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        iconFile: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'default_avatar.png'
        },
        language: {
            type: DataTypes.STRING(5),
            allowNull: false,
            defaultValue: 'en',
            validate: {
                isIn: [['ro', 'en']]
            }
        },
        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'RON',
            validate: {
                isIn: [['RON', 'EUR']]
            }
        },
        hasImportedBankData: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'Users',
        modelName: 'User',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['username']
            },
            {
                unique: true,
                fields: ['email']
            }
        ]
    }
);

export default User;