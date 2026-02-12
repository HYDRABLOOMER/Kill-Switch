const express = require('express');
const router = express.Router();
const { createScan, getScanHistory } = require('../controllers/scanController');
const { authMiddleware } = require('../middleware/auth');

// Create a scan (type = xss, sql, cve, full, etc.)
router.post('/:type', authMiddleware, createScan);

// Get user's scan history
router.get('/history', authMiddleware, getScanHistory);


module.exports = router;
