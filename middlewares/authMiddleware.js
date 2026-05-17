const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token missing! :/' });
    }

    try {
        const verified = jwt.verify(token, jwtConfig.secret);
        req.user = verified; 
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token! :/' });
    }
};

exports.requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden. Insufficient permissions! :/' });
        }
        next();
    };
};