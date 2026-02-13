import Budget from "./models/Budget.js";
import Category from "./models/Category.js";
import SavingsGoal from "./models/SavingsGoal.js";
import Transaction from "./models/Transaction.js";
import User from "./models/User.js";

//An user creates many categories
User.hasMany(Category, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Category.belongsTo(User, {
    foreignKey: 'userId'
});


//An user has many transactions
User.hasMany(Transaction, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(User, {
    foreignKey: 'userId'
});


//A category has many transactions
Category.hasMany(Transaction, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(Category, {
    foreignKey: 'categoryId'
});

//An user has many budgets
User.hasMany(Budget, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Budget.belongsTo(User, {
    foreignKey: 'userId'
});

//A category has many budgets
Category.hasMany(Budget, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});

Budget.belongsTo(Category, {
    foreignKey: 'categoryId'
});

//An user has many savings goals
User.hasMany(SavingsGoal, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

SavingsGoal.belongsTo(User, {
    foreignKey: 'userId'
});

export { User, Category, Transaction, Budget, SavingsGoal };