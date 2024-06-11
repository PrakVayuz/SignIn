const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Admin sign-in route
router.post('/signin', adminController.signInAdmin);

// Route for creating users by admin
router.post('/users', authMiddleware.adminAuth, adminController.createUser);

router.get('/test', (req, res) => {
    res.send('Admin route works!');
});

router.get('/users', authMiddleware.adminAuth, adminController.getUsersByAdmin);


module.exports = router;
