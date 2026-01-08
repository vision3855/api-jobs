require('dotenv').config();
const { UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //const user = User.findOne(payload.id).select('-password');

        req.user = payload;
        next();
    } catch (error) {
        throw new UnauthenticatedError("Not authorized to access this route");
    }
    
}

module.exports = authenticationMiddleware