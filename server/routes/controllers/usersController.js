import { User } from "../../database/associations.js";

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    
}

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, iconFile, language, currency } = req.body;

        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(iconFile) user.iconFile = iconFile;
        if(language) user.language = language;
        if(currency) user.currency = currency;

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export default { getProfile, updateProfile };