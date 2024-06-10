const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.post('/users', authMiddleware, adminController.createUser);

module.exports = router;
