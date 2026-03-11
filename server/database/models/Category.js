import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

//Category entity table configuration
class Category extends Model{};

Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['income', 'expense']]
        }
    },
    iconFile: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'default_icon.png'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
        //If this is null then it means that the category belongs to the system, not the user
    }
},
{
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true
});

export default Category;