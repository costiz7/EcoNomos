import { SavingsGoal } from "../../database/associations.js";
import { Op } from "sequelize";

/**
 * Creates a new savings goal for the authenticated user.
 * 
 * The function validates that the required fields (title, target amount, and deadline) 
 * are provided and ensures the target amount is greater than zero. If valid, it creates 
 * a new savings goal record in the database with an initial current amount of 0.
 *
 * @async
 * @function createGoal
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing savings goal details.
 * @param {string} req.body.title - The title or name of the savings goal.
 * @param {number|string} req.body.targetAmount - The financial target to reach (must be greater than 0).
 * @param {string|Date} req.body.deadline - The target date to achieve the goal.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the newly created savings goal data (status 201),
 *                            or an error message for missing/invalid fields (status 400) or server errors (status 500).
 */
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
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
};

/**
 * Adds funds to a specific savings goal for the authenticated user.
 * 
 * The function validates that the amount to add is a positive number, then fetches 
 * the target savings goal ensuring it belongs to the requesting user. It adds the 
 * funds to the goal's current amount, checks if the target amount has been reached, 
 * saves the progress, and returns an appropriate success message.
 *
 * @async
 * @function addFunds
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {number|string} req.params.id - The ID of the savings goal to update.
 * @param {Object} req.body - The request body containing the update details.
 * @param {number|string} req.body.amountToAdd - The amount of funds to add to the goal (must be greater than 0).
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with a success message, the updated goal data, and a boolean indicating if the target was reached (status 200),
 *                            or an error message for invalid amounts (status 400), unauthorized/not found goals (status 404), or server errors (status 500).
 */
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
                ? 'Congrats! You reached your savings target.' 
                : 'Funds added!',
            goal: goal,
            targetReached: isTargetReached
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
};

/**
 * Retrieves all savings goals for the authenticated user and calculates their progress.
 * 
 * The function fetches the user's savings goals from the database, sorted by 
 * creation date in descending order. It then maps through the results to calculate 
 * the progress percentage and determine if each goal has been completed, returning 
 * an array of formatted goal objects.
 *
 * @async
 * @function getGoals
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array of the user's savings goals with calculated progress metrics (status 200),
 *                            or a server error message if something goes wrong (status 500).
 */
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
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
};

/**
 * Deletes a specific savings goal for the authenticated user.
 * 
 * The function looks for a savings goal by its ID, ensuring that it belongs 
 * to the currently authenticated user. If found, it permanently removes the 
 * savings goal record from the database.
 *
 * @async
 * @function deleteGoal
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {number|string} req.params.id - The ID of the savings goal to be deleted.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with a success message (status 200),
 *                            an error message if the goal is not found or unauthorized (status 404),
 *                            or a server error message (status 500).
 */
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
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
};

export default { 
    createGoal,
    addFunds,
    getGoals,
    deleteGoal
 };