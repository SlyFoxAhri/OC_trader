// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isCharacterOwnerOrAdmin } = require('../middlewares/characterMiddleware');

// 1. Upload Route: Requires login authentication and character ownership confirmation
router.post(
    '/characters/:characterId/upload',
    authenticateToken,
    (req, res, next) => {
        // Adapt character middleware logic parameters check override since parameter is characterId
        req.params.id = req.params.characterId;
        next();
    },
    isCharacterOwnerOrAdmin,
    upload.single('picture'), 
    fileController.uploadCharacterPicture
);

// 2. Download/Display Route: Accessible by anyone, but checked internally for visibility rules
router.get(
    '/pictures/:id/download',
    (req, res, next) => {
        // Optional login processing bypass: If header is present, decrypt token info to know who they are
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const jwt = require('jsonwebtoken');
            const jwtConfig = require('../config/jwt');
            try {
                req.user = jwt.verify(token, jwtConfig.secret);
            } catch (e) { /* ignore expired credentials during preview check */ }
        }
        next();
    },
    fileController.downloadPicture
);

module.exports = router;