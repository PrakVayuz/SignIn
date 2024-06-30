const express = require('express');
const { createUser, getAllForms, signInAdmin,getAllUsers} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const twilio = require('twilio');
require('dotenv').config();

router.post('/create-user', adminAuth, createUser);
router.post('/sign-in', signInAdmin);
router.get('/forms', adminAuth, getAllForms);
router.get('/users', adminAuth, getAllUsers); 

const upload = multer({ dest: 'uploads/' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


router.post('/broadcast', adminAuth, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        
        console.log("Data from Excel:", data); 
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const phoneNumbers = data.map(row => `+${row.contactNo}`);
        console.log("Phone numbers:", phoneNumbers); // Log to see the phone numbers extracted

        for (const number of phoneNumbers) {
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: number,
            });
        }

        res.status(200).json({ message: 'Messages sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/send-message', adminAuth, async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({ message: 'Phone number and message are required' });
        }

        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+${phoneNumber}`,
        });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;
