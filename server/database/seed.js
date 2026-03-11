import Category from "./models/Category.js";

//This async function seeds the database at the 1st start with all the system categories
export const seedCategories = async () => {
    try {
        const defaultCategories = [
            { name: 'food', type: 'expense', iconFile: 'icon_food' },
            { name: 'transport', type: 'expense', iconFile: 'icon_transport' },
            { name: 'utilities', type: 'expense', iconFile: 'icon_utilities' },
            { name: 'entertainment', type: 'expense', iconFile: 'icon_entertainment' },
            { name: 'shopping', type: 'expense', iconFile: 'icon_shopping' },
            { name: 'health', type: 'expense', iconFile: 'icon_health' },
            { name: 'salary', type: 'income', iconFile: 'icon_salary' }
        ];

        for (const cat of defaultCategories) {
            const exists = await Category.findOne({
                where: { 
                    name: cat.name,
                    userId: null 
                }
            });

            if (!exists) {
                await Category.create({
                    name: cat.name,
                    type: cat.type,
                    iconFile: cat.iconFile,
                    userId: null
                });
                console.log(`Added category: ${cat.name}`);
            }
        }
    } catch (error) {
        console.error("Seeding error:", error);
    }
};