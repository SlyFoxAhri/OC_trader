const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const registerValidation = [
    body('email').isEmail().withMessage('Enter yo email'),
    body('password')
        .isLength({ min: 8, max: 24 })
        .withMessage('Password must be between 8 and 24 characters')
        .isStrongPassword({ minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage('Password must contain uppercase, lowercase, number and a symbol')
];

const loginValidation = [
    body('email').isEmail().withMessage('Enter yo email'),
    body('password').isString().withMessage('Enter yo password')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

module.exports = router;