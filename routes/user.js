const express = require('express');
const { signInUser, submitForm } = require('../controllers/userController');
const { userAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/sign-in', signInUser);
router.post('/submit-form', userAuth, submitForm);

module.exports = router;
