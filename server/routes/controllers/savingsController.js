import { SavingsGoal } from "../../database/associations.js";
import { Op } from "sequelize";

const createGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline } = req.body;

        if (!title || !targetAmount || !deadline) {
            return res.status(400).json({ 
                message: 'All the fields must be completed.' 
            });
        }

        if (parseFloat(targetAmount) <= 0) {
            return res.status(400).json({ message: 'The amount has to be greater than 0.' });
        }

        const newGoal = await SavingsGoal.create({
            title, 
            targetAmount, 
            currentAmount: 0,
            deadline,
            userId: req.user.id 
        });

        res.status(201).json(newGoal);

    } catch (error) {
        res.status(500).json({ message: 'Could not create saving goal.', error: error.message });
    }
};

const addFunds = async (req, res) => {
    try {
        const { id } = req.params;
        const { amountToAdd } = req.body;

        if (!amountToAdd || isNaN(amountToAdd) || parseFloat(amountToAdd) <= 0) {
            return res.status(400).json({ message: 'The amount has to be greater than 0.' });
        }

        const goal = await SavingsGoal.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!goal) {
            return res.status(404).json({ message: 'The goal was not found or you don\'t have permission to access it.' });
        }

        const funds = parseFloat(amountToAdd);
        goal.currentAmount = parseFloat(goal.currentAmount) + funds;

        const target = parseFloat(goal.targetAmount);
        let isTargetReached = false;
        
        if (goal.currentAmount >= target) {
            isTargetReached = true;
        }

        await goal.save();

        res.status(200).json({
            message: isTargetReached 
                ? 'Congrats! You filled your piggybank.' 
                : 'Funds added!',
            goal: goal,
            targetReached: isTargetReached
        });

    } catch (error) {
        res.status(500).json({ message: 'Could not add funds.', error: error.message });
    }
};

const getGoals = async (req, res) => {
    try {
        const goals = await SavingsGoal.findAll({
            where: {
                userId: req.user.id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        const goalsWithProgress = goals.map(goal => {
            const current = parseFloat(goal.currentAmount);
            const target = parseFloat(goal.targetAmount);
            
            let percentage = target > 0 ? (current / target) * 100 : 0;
            
            percentage = Math.round(percentage * 100) / 100;

            return {
                id: goal.id,
                title: goal.title,
                targetAmount: target,
                currentAmount: current,
                deadline: goal.deadline,
                progressPercentage: percentage,
                isCompleted: current >= target
            };
        });

        res.status(200).json(goalsWithProgress);

    } catch (error) {
        res.status(500).json({ message: 'Could not retrieve your goals.', error: error.message });
    }
};

export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        const goal = await SavingsGoal.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!goal) {
            return res.status(404).json({ message: 'The goal was not found or you don\'t have access to delete it..' });
        }

        await goal.destroy();

        res.status(200).json({ message: 'Goal deleted.' });

    } catch (error) {
        res.status(500).json({ message: 'Could not delete goal.', error: error.message });
    }
};

export default { 
    createGoal,
    addFunds,
    getGoals,
    deleteGoal
 };