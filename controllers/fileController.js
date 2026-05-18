// controllers/fileController.js
const fileService = require('../services/fileService');

exports.uploadCharacterPicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please select a picture to upload! :/' });
        }

        const characterId = req.params.characterId;
        
        const pictureRecord = await fileService.savePictureMetadata(req.file, characterId);

        return res.status(201).json({
            message: 'Picture metadata successfully registered! :3',
            picture: pictureRecord
        });
    } catch (err) {
        if (req.file) {
            const fs = require('fs');
            const path = require('path');
            const deletePath = path.join(__dirname, '../uploads', req.file.filename);
            if (fs.existsSync(deletePath)) fs.unlinkSync(deletePath);
        }

        if (err.message === 'CHARACTER_NOT_FOUND') {
            return res.status(404).json({ error: 'Character record not found :/' });
        }
        next(err);
    }
};

exports.downloadPicture = async (req, res, next) => {
    try {
        const pictureId = req.params.id;
        const filePayload = await fileService.getPictureFileAndValidateAccess(pictureId, req.user);

        res.setHeader('Content-Type', filePayload.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filePayload.originalName}"`);

        return res.sendFile(filePayload.filePath);
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Picture entry not found :/' });
        if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'This character image profile is marked private! :/' });
        if (err.message === 'FILE_MISSING_ON_DISK') return res.status(410).json({ error: 'Physical image asset missing from server storage :/' });
        next(err);
    }
};