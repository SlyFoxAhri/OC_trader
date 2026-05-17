module.exports = {
    secret: process.env.JWT_SECRET || 'super-secret-oc-hub-key-2026',
    expiresIn: '24h'
};