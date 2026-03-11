import jwt from 'jsonwebtoken';

//This middleware decodes the received token when trying to make a request
//and attaches 'user' property to every request body so the frontend knows who made the request
const tokenCheck = (req, res, next) => {
    let token;

    if(req.headers.token) {
        try {
            token = req.headers.token;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    }

    if(!token) {
        res.status(401).json({ message: 'Not authorized, there is no token' });
    }
}

export default tokenCheck;