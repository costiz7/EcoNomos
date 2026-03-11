import { User } from "../../database/associations.js";

/**
 * Retrieves the profile information of the currently authenticated user.
 * 
 * This function fetches the user's data from the database using their ID, 
 * ensuring that sensitive information like the password is excluded from 
 * the returned object.
 *
 * @async
 * @function getProfile
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the user's profile data (status 200),
 *                            an error message if the user is not found (status 404),
 *                            or a server error message (status 500).
 */
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
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
    
}

/**
 * Updates the profile information for the currently authenticated user.
 * 
 * The function fetches the user from the database (excluding the password),
 * updates the provided fields (first name, last name, avatar icon, language, or currency) 
 * if they are present in the request body, and saves the changes.
 *
 * @async
 * @function updateProfile
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing the fields to update.
 * @param {string} [req.body.firstName] - The updated first name of the user.
 * @param {string} [req.body.lastName] - The updated last name of the user.
 * @param {string} [req.body.iconFile] - The updated filename or URL for the user's avatar.
 * @param {string} [req.body.language] - The updated preferred language.
 * @param {string} [req.body.currency] - The updated preferred currency.
 * @param {Object} req.user - The authenticated user object (provided by authentication middleware).
 * @param {number|string} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with the updated user profile (status 200),
 *                            an error message if the user is not found (status 404),
 *                            or a server error message (status 500).
 */
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
        res.status(500).json({ message: 'Server Error: ', error: error.message });
    }
}

export default { getProfile, updateProfile };