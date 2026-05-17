const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const characterController = require('../controllers/characterController');

const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const { isCharacterOwnerOrAdmin } = require('../middlewares/characterMiddleware');

const characterValidation = [
    body('name').notEmpty().trim().withMessage('Character name is required'),
    body('age').optional({ nullable: true }).isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('visibility').optional().isIn(['public', 'private']).withMessage('Visibility must be public or private')
];

router.use(authenticateToken);

router.get('/', characterController.getAllCharacters);
router.post('/', characterValidation, characterController.createCharacter);
router.get('/:id', characterController.getCharacterById);

router.put('/:id', isCharacterOwnerOrAdmin, characterValidation, characterController.updateCharacter);
router.delete('/:id', isCharacterOwnerOrAdmin, characterController.deleteCharacter);

router.put('/:id/admin-private', requireRole(['admin']), characterController.adminForcePrivate);

module.exports = router;