const User = require('../models/User');
const Form = require('../models/Form');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilioClient = require('../twilio/twilio');
require('dotenv').config();


exports.signInUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Sign In successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.submitForm = async (req, res) => {
    try {
        const { name, contactNo, city, remarks, selectedEmoji } = req.body;
        const userId = req.user._id;

        const form = new Form({
            name,
            contactNo,
            city,
            remarks,
            selectedEmoji,
            user: userId,
        });

        await form.save();
        console.log('Twilio SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Twilio Auth Token:', process.env.TWILIO_AUTH_TOKEN);
console.log('Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);


        // Send thank you message
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

 client.messages.create({
    body: 'Hello from Twilio',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: '+91 9125377622'  // Replace with a valid phone number for testing
})
.then(message => console.log('Message sent:', message.sid))
.catch(error => console.error('Error sending message:', error));

        res.status(201).json({ message: 'Form submitted successfully and SMS sent', form });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.selectEmoji = async (req, res) => {
    try {
        const { selectedEmoji } = req.body;
        if (!selectedEmoji) {
            return res.status(400).json({ message: 'Emoji type is required' });
        }

        req.user.selectedEmoji = selectedEmoji;
        await req.user.save();
        res.status(200).json({ message: 'Emoji selected', selectedEmoji });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
