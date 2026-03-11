import { Category } from "../../database/associations.js";
import { Op } from "sequelize";

/**
 * Retrieves all categories available to the authenticated user.
 * 
 * The function fetches both custom categories created by the user and 
 * default global categories (where userId is null). The results are sorted 
 * by userId and then alphabetically by the category name.
 *
 * @async
 * @function getAllCategories
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON array containing the category objects,
 *                            or a server error message if the database query fails (status 500).
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: {
                [Op.or]: [
                    { userId: req.user.id },
                    { userId: null }
                ]
            },
            order: [
                ['userId', 'ASC'],
                ['name', 'ASC']
            ]
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
}

/**
 * Creates a new custom category for the authenticated user.
 * 
 * The function validates the required category name and type (which must be 
 * either 'income' or 'expense'). If valid, it creates a new category record 
 * in the database associated with the user, applying a default icon if none is provided.
 *
 * @async
 * @function createCategory
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing category details.
 * @param {string} req.body.name - The name of the new category.
 * @param {string} req.body.type - The type of category (must be 'income' or 'expense').
 * @param {string} [req.body.iconFile='category1'] - (Optional) The icon filename for the category. Defaults to 'category1'.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the newly created category data (status 201),
 *                            or an error message for missing/invalid fields (status 400) or server errors (status 500).
 */
const createCategory = async (req, res) => {
    try {
        const { name, type, iconFile } = req.body;

        if(!name) {
            return res.status(400).json({ message: 'You forgot the name of the category.' });
        }

        if(type !== 'income' && type !== 'expense') {
            return res.status(400).json({ message: 'Invalid type! It has to be \'income\' or \'expense\'' });
        }

        const newCategory = await Category.create({
            name,
            type,
            iconFile: iconFile || 'icon_default',
            userId: req.user.id
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
}

/**
 * Updates an existing custom category for the authenticated user.
 * 
 * The function fetches the category by its ID and verifies that it exists, 
 * is not a global/default category (where userId is null), and belongs to the 
 * requesting user. If all authorization checks pass, it updates the category's 
 * name and/or icon.
 *
 * @async
 * @function updateCategory
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing the update details.
 * @param {string} [req.body.name] - (Optional) The new name for the category.
 * @param {string} [req.body.iconFile] - (Optional) The new icon filename for the category.
 * @param {Object} req.params - The route parameters.
 * @param {number|string} req.params.id - The ID of the category to be updated.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the updated category data,
 *                            or an error message if the category is not found (status 404), 
 *                            unauthorized/forbidden to modify (status 403), or a server error occurs (status 500).
 */
const updateCategory = async (req, res) => {
    try {
        const { name, iconFile } = req.body;
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if(!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        if(category.userId === null) {
            return res.status(403).json({ message: 'You can\'t modify this category' });
        }

        if(category.userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to modify this category.' });
        }

        if(name) category.name = name;
        if(iconFile) category.iconFile = iconFile;

        await category.save();

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
}

/**
 * Deletes a specific custom category for the authenticated user.
 * 
 * The function fetches the category by its ID and ensures it exists. It then 
 * verifies that the category is not a global/default category (where userId is null) 
 * and that it belongs to the requesting user before permanently deleting it from the database.
 *
 * @async
 * @function deleteCategory
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {number|string} req.params.id - The ID of the category to be deleted.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with a success message,
 *                            or an error message if the category is not found (status 404), 
 *                            unauthorized/forbidden to delete (status 403), or a server error occurs (status 500).
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if(!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        if(category.userId === null) {
            return res.status(403).json({ message: 'You can\'t delete this category!' });
        }

        if(category.userId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this category.' });
        }

        await category.destroy();

        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: "Server Error: ", error: error.message });
    }
}

export default { getAllCategories, createCategory, deleteCategory, updateCategory };