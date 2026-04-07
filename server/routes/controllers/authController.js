import { User } from "../../database/associations.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, iconFile, language, currency } = req.body;

        const existingUsername = await User.findOne({ where: { username }});
        if(existingUsername) {
            return res.status(400).json({ errorCode: 'USERNAME_TAKEN' });
        }
        
        const existingEmail = await User.findOne({ where: { email } });
        if(existingEmail) {
            return res.status(400).json({ errorCode: 'EMAIL_TAKEN' });
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
        console.error("Error at register:", error);
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if(!user) {
            return res.status(400).json({ errorCode: 'INVALID_CREDENTIALS' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ errorCode: 'INVALID_CREDENTIALS' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userData = user.toJSON();

        delete userData.password;

        res.status(200).json({ token, user: userData });
    } catch (error) {
        console.error("Error at login:", error);
        res.status(500).json({ errorCode: 'SERVER_ERROR', error: error.message });
    }
}

export { register, login };