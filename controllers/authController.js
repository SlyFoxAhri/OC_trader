const authService = require('../services/authService');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const { email, password } = req.body;
        await authService.registerUser(email, password);
        return res.status(201).json({ message: 'Success :3' });
    } catch (err) {
        if (err.message === 'EMAIL_EXISTS') {
            return res.status(400).json({ error: 'Email already registered :/' });
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const { email, password } = req.body;
        const token = await authService.loginUser(email, password);
        return res.status(200).json({ message: 'Logged in :3', token });
    } catch (err) {
        if (err.message === 'INVALID_CREDENTIALS') {
            return res.status(400).json({ error: 'Wrong email or password :/' });
        }
        next(err);
    }
};