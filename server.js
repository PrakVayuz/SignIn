const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;
const connectDB = require('./db');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
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
