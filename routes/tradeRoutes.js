// routes/tradeRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tradeController = require('../controllers/tradeController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Enforce login for all trading parameters
router.use(authenticateToken);

const proposeValidation = [
    body('senderCharacterId').isInt().withMessage('Offer character ID must be an integer'),
    body('receiverCharacterId').isInt().withMessage('Target requested character ID must be an integer')
];

const respondValidation = [
    body('status').isIn(['accepted', 'rejected']).withMessage('Response status must be accepted or rejected')
];

router.post('/', proposeValidation, tradeController.proposeTrade);
router.get('/', tradeController.getTrades);
router.put('/:id/respond', respondValidation, tradeController.respondToTrade);

module.exports = router;