const express = require('express');
const { createUser, getAllForms, signInAdmin } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/create-user', adminAuth, createUser);
router.post('/sign-in', signInAdmin);
router.get('/forms', adminAuth, getAllForms);

module.exports = router;
