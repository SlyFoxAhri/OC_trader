// controllers/tradeController.js
const tradeService = require('../services/tradeService');
const { validationResult } = require('express-validator');

exports.proposeTrade = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const trade = await tradeService.proposeTrade(req.user.userId, req.body);
        return res.status(201).json({ message: 'Trade proposal sent successfully! :3', trade });
    } catch (err) {
        if (err.message === 'MUST_OWN_OFFERED_CHARACTER') {
            return res.status(403).json({ error: 'You do not own the character you are offering! :/' });
        }
        if (err.message === 'REQUESTED_CHARACTER_NOT_FOUND') {
            return res.status(404).json({ error: 'The requested target character could not be found :/' });
        }
        if (err.message === 'CANNOT_TRADE_PRIVATE_CHARACTER') {
            return res.status(400).json({ error: 'You can only trade with characters that are marked public! :/' });
        }
        if (err.message === 'CANNOT_TRADE_WITH_SELF') {
            return res.status(400).json({ error: 'You cannot propose a trade request to yourself! :/' });
        }
        next(err);
    }
};

exports.getTrades = async (req, res, next) => {
    try {
        const trades = await tradeService.getUserTrades(req.user.userId);
        return res.status(200).json(trades);
    } catch (err) {
        next(err);
    }
};

exports.respondToTrade = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const result = await tradeService.respondToTrade(req.params.id, req.user.userId, status);
        return res.status(200).json(result);
    } catch (err) {
        if (err.message === 'TRADE_NOT_FOUND') return res.status(404).json({ error: 'Trade request not found :/' });
        if (err.message === 'UNAUTHORIZED_ACTION') return res.status(403).json({ error: 'You are not authorized to respond to this trade! :/' });
        if (err.message === 'TRADE_ALREADY_PROCESSED') return res.status(400).json({ error: 'This trade has already been processed or closed :/' });
        if (err.message === 'OWNERSHIP_CHANGED_BEFORE_ACCEPTANCE') return res.status(409).json({ error: 'Trade invalid: Characters changed ownership prior to approval :/' });
        next(err);
    }
};