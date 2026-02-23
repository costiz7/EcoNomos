import { Budget } from "../../database/associations.js";
import { Op } from "sequelize";

const createBudget = async (req, res) => {
    try {
        //TO-DO
    } catch (error) {
        res.status(500).json({ message: 'Could not create budget', error: error.message });
    }
}

const getMyBudgets = async (req, res) => {
    try {
        //TO-DO
    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve budgets', error: error.message });
    }
}

const deleteBudget = async (req, res) => {
    try {
        //TO-DO
    } catch (error) {
        res.status(500).json({ message: 'Could not delete budget', error: error.message });
    }
}

const checkBudgetStatus = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve status', error: error.message });
    }
}

export default {
    createBudget,
    getMyBudgets,
    deleteBudget,
    checkBudgetStatus
}