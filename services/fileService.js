// services/fileService.js
const { Picture, Character } = require('../models/index');
const path = require('path');
const fs = require('fs');

exports.savePictureMetadata = async (fileData, characterId) => {
    // 1. Verify character target entity profile exists
    const character = await Character.findByPk(characterId);
    if (!character) {
        throw new Error('CHARACTER_NOT_FOUND');
    }

    // 2. Store all specified metadata parameters into the relational database
    return await Picture.create({
        originalName: fileData.originalname,
        storedName: fileData.filename,
        mimeType: fileData.mimetype,
        size: fileData.size,
        uploadDate: new Date(),
        characterId: parseInt(characterId, 10)
    });
};

exports.getPictureFileAndValidateAccess = async (pictureId, requestUser) => {
    // Include the character details to verify visibility boundaries
    const picture = await Picture.findByPk(pictureId, {
        include: { model: Character, as: 'character' }
    });

    if (!picture) {
        throw new Error('NOT_FOUND');
    }

    const character = picture.character;
    
    // Safety boundary rules check:
    // If the associated character profile is flagged private, restrict viewing permissions
    if (character.visibility === 'private') {
        if (!requestUser || (requestUser.role !== 'admin' && character.userId !== requestUser.userId)) {
            throw new Error('FORBIDDEN');
        }
    }

    // Resolve physical path on disk
    const absoluteFilePath = path.join(__dirname, '../uploads', picture.storedName);
    
    if (!fs.existsSync(absoluteFilePath)) {
        throw new Error('FILE_MISSING_ON_DISK');
    }

    return {
        filePath: absoluteFilePath,
        mimeType: picture.mimeType,
        originalName: picture.originalName
    };
};