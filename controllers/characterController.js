const characterService = require('../services/characterService');
const { validationResult } = require('express-validator');

exports.createCharacter = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const character = await characterService.createCharacter(req.body, req.user.userId);
        return res.status(201).json({ message: 'OC created successfully! :3', character });
    } catch (err) {
        next(err);
    }
};

exports.getAllCharacters = async (req, res, next) => {
    try {
        const characters = await characterService.getAllCharacters(req.user.role);
        return res.status(200).json(characters);
    } catch (err) {
        next(err);
    }
};

exports.getCharacterById = async (req, res, next) => {
    try {
        const character = await characterService.getCharacterById(req.params.id, req.user);
        return res.status(200).json(character);
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Character not found :/' });
        if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'This character profile is set to private! :/' });
        next(err);
    }
};

exports.updateCharacter = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const character = await characterService.updateCharacter(req.character, req.body);
        return res.status(200).json({ message: 'Character updated! :3', character });
    } catch (err) {
        next(err);
    }
};

exports.deleteCharacter = async (req, res, next) => {
    try {
        await characterService.deleteCharacter(req.character);
        return res.status(200).json({ message: 'Character deleted successfully. Goodbye! :3' });
    } catch (err) {
        next(err);
    }
};

exports.adminForcePrivate = async (req, res, next) => {
    try {
        const character = await characterService.forcePrivateVisibility(req.params.id);
        return res.status(200).json({ 
            message: `Admin Override: Character "${character.name}" forced to private.`, 
            character 
        });
    } catch (err) {
        if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Character not found :/' });
        next(err);
    }
};