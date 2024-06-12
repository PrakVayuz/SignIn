const Admin = require('../models/Admin');
const User = require('../models/User');
const Form = require('../models/Form');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const { username, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = new User({ username, password: hashedPassword, admin: adminId });
        await newUser.save();

        await Admin.findByIdAndUpdate(adminId, { $push: { users: newUser._id } });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.signInAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: admin._id, role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Sign In successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAllForms = async (req, res) => {
    try {
        const forms = await Form.find().populate('user');
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const users = await User.find({ admin: adminId });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
