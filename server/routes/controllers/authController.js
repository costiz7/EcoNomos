import { User } from "../../database/associations.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, iconFile, language, currency } = req.body;

        const existingUsername = await User.findOne({ where: { username }});
        if(existingUsername) {
            return res.status(400).json({ message: 'This username is already being used by someone. Try another one!'})
        }
        
        const existingEmail = await User.findOne({ where: { email } });
        if(existingEmail) {
            return res.status(400).json({ message: 'This email is already being used. Try to login!' })
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
        res.status(500).json({ message: 'We encountered some server error!', error: error.message });
    }
}

export { register };