import { Category } from "../../database/associations.js";
import { Op } from "sequelize";

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
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const createCategory = async (req, res) => {
    try {
        const { name, type, iconFile } = req.body;

        if(!name) {
            return res.status(400).json({ message: 'You forgot about the name' });
        }

        if(type !== 'income' && type !== 'expense') {
            return res.status(400).json({ message: 'Tip invalid! Trebuie sa fie \'income\' sau \'expense\'' });
        }

        const newCategory = await Category.create({
            name,
            type,
            iconFile: iconFile || 'category1',
            userId: req.user.id
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

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
        res.status(500).json({ message: 'Could not modify the category', error: error.message });
    }
}

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
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export default { getAllCategories, createCategory, deleteCategory, updateCategory };