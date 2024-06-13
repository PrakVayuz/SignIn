const User = require('../models/User');
const Form = require('../models/Form');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        res.status(201).json({ message: 'Form submitted successfully', form });
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
