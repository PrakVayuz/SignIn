const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;
const secretKey = process.env.SECRET_KEY;

// Connect to MongoDB
const connectDB = require('./db');
connectDB();

app.use(bodyParser.json());

const user = {
    userId: 'user123',
    password: bcrypt.hashSync('pass123', 8)
};

app.post('/sign-in', (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).send({ message: 'UserID and Password are required' });
    }

    if (userId === user.userId && bcrypt.compareSync(password, user.password)) {
        // Generate JWT token
        const token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '1h' });
        return res.status(200).send({ message: 'Sign In successful', token });
    } else {
        return res.status(401).send({ message: 'Invalid UserID or Password' });
    }
});

app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token' });
        }
        res.status(200).send({ message: 'Access to protected route', userId: decoded.userId });
    });
});

app.post('/forgot-password', (req, res) => {
    return res.status(200).send({ message: 'Contact at defenceworksindia@yahoo.com' });
});

let selectedEmoji = null;

app.post('/select-emoji', (req, res) => {
    const { emojiType } = req.body;

    if (!emojiType) {
        return res.status(400).send({ message: 'Emoji type is required' });
    }

    selectedEmoji = emojiType;
    return res.status(200).send({ message: 'Emoji selected', selectedEmoji });
});

app.post('/submit-form', (req, res) => {
    const { name, contactNo, city, remarks } = req.body;

    if (!name || !contactNo) {
        return res.status(400).send({ message: 'Name and Contact No are required' });
    }

    const formData = {
        name,
        contactNo,
        city,
        remarks,
        selectedEmoji
    };

    return res.status(200).send({ message: 'Form submitted successfully', formData });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
