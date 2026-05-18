const { Character, User } = require('../models/index');

exports.createCharacter = async (data, userId) => {
    return await Character.create({
        ...data,
        userId
    });
};

exports.getAllCharacters = async (userRole) => {
    if (userRole === 'admin') {
        return await Character.findAll({
            include: { model: User, as: 'owner', attributes: ['id', 'email'] }
        });
    }
    return await Character.findAll({
        where: { visibility: 'public' },
        include: { model: User, as: 'owner', attributes: ['id', 'email'] }
    });
};

exports.getCharacterById = async (id, user) => {
    const character = await Character.findByPk(id, {
        include: { model: User, as: 'owner', attributes: ['id', 'email'] }
    });

    if (!character) throw new Error('NOT_FOUND');

    if (character.visibility === 'private' && user.role !== 'admin' && character.userId !== user.userId) {
        throw new Error('FORBIDDEN');
    }

    return character;
};

exports.updateCharacter = async (characterInstance, updatedData) => {
    return await characterInstance.update(updatedData);
};

exports.deleteCharacter = async (characterInstance) => {
    return await characterInstance.destroy();
};

exports.forcePrivateVisibility = async (id) => {
    const character = await Character.findByPk(id);
    if (!character) throw new Error('NOT_FOUND');
    return await character.update({ visibility: 'private' });
};