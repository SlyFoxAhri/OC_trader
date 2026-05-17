const { Character } = require('../models/index');

exports.isCharacterOwnerOrAdmin = async (req, res, next) => {
    try {
        const characterId = req.params.id;
        const userId = req.user.userId;
        const userRole = req.user.role;

        const character = await Character.findByPk(characterId);
        if (!character) {
            return res.status(404).json({ error: 'Character not found :/' });
        }

        req.character = character;

        if (userRole === 'admin' || character.userId === userId) {
            return next();
        }

        return res.status(403).json({ error: 'Access forbidden. You do not own this character! :/' });
    } catch (err) {
        next(err);
    }
};