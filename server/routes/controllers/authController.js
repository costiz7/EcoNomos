import { User } from "../../database/associations.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Registers a new user in the database.
 * 
 * The function extracts data from the request body, checks if the 
 * username or email is already in use, hashes the password using bcrypt, 
 * and creates a new user account.
 *
 * @async
 * @function register
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing user data.
 * @param {string} req.body.firstName - The user's first name.
 * @param {string} req.body.lastName - The user's last name.
 * @param {string} req.body.username - The username (must be unique).
 * @param {string} req.body.email - The user's email address (must be unique).
 * @param {string} req.body.password - The plain-text password (will be hashed).
 * @param {string} [req.body.iconFile] - (Optional) The filename or URL for the user's avatar.
 * @param {string} [req.body.language] - (Optional) The user's preferred language.
 * @param {string} [req.body.currency] - (Optional) The user's preferred currency.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with a success message and the new user data (status 201),
 *                            or an error message if the user already exists (status 400) or a server error occurs (status 500).
 */
const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, iconFile, language, currency } = req.body;

        const existingUsername = await User.findOne({ where: { username }});
        if(existingUsername) {
            return res.status(400).json({ message: 'This username is already taken. Try another one.'})
        }
        
        const existingEmail = await User.findOne({ where: { email } });
        if(existingEmail) {
            return res.status(400).json({ message: 'This email is already taken. Try to login.' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            iconFile,
            language,
            currency
        });

        res.status(201).json({ message: `Welcome, ${username}!`, newUser });
    } catch (error) {
        res.status(500).json({ message: 'Can\'t create account!', error: error.message });
    }
}

/**
 * Authenticates a user and generates a JSON Web Token (JWT).
 * 
 * The function verifies the provided email and password against the database.
 * If the credentials are valid, it creates a JWT valid for 7 days and returns 
 * it along with the user data.
 *
 * @async
 * @function login
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {string} req.body.email - The user's registered email address.
 * @param {string} req.body.password - The user's plain-text password.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} Returns a JSON response with a JWT and user data (status 200),
 *                            or an error message for invalid credentials (status 400) or server errors (status 500).
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if(!user) {
            return res.status(400).json({ message: 'The email or the password are wrong!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'The email or the password are wrong!' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Can\'t login user!', error: error.message });
    }
}

export { register, login };