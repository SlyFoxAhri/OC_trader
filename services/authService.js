// services/authService.js
const { User, Role } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

exports.registerUser = async (email, password) => {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('EMAIL_EXISTS');
    }

    // Get default role
    const defaultRole = await Role.findOne({ where: { name: 'user' } });
    if (!defaultRole) {
        throw new Error('ROLE_NOT_INITIALIZED');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
        email,
        passwordHash: hashedPassword,
        roleId: defaultRole.id
    });
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ 
        where: { email },
        include: { model: Role, as: 'role' }
    });

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role.name
    };

    const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    return token;
};