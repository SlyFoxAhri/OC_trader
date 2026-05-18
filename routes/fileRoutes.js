const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isCharacterOwnerOrAdmin } = require('../middlewares/characterMiddleware');


router.post(
    '/characters/:characterId/upload',
    authenticateToken,
    (req, res, next) => {
        req.params.id = req.params.characterId;
        next();
    },
    isCharacterOwnerOrAdmin,
    upload.single('picture'), 
    fileController.uploadCharacterPicture
);

router.get(
    '/pictures/:id/download',
    (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const jwt = require('jsonwebtoken');
            const jwtConfig = require('../config/jwt');
            try {
                req.user = jwt.verify(token, jwtConfig.secret);
            } catch (e) { }
        }
        next();
    },
    fileController.downloadPicture
);

module.exports = router;