const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Admin sign-in route
router.post('/sign-in', adminController.signInAdmin);

// Route for creating users by admin
router.post('/users', authMiddleware.adminAuth, adminController.createUser);

module.exports = router;
