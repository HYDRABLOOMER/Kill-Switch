const express = require('express');
const router = express.Router();
const { register, login, getScanHistory, getMe } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// User routes
router.post('/register', register);
router.post('/login', login);
router.get('/:userId/scans', getScanHistory);
router.get('/me', authMiddleware, getMe);

module.exports = router;

 