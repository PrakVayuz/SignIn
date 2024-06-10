const Admin = require('../models/Admin');
const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const adminId = req.admin._id; // assuming admin ID is available in req.admin
        const { username, email, password } = req.body;

        const newUser = new User({ username, email, password, admin: adminId });
        await newUser.save();

        await Admin.findByIdAndUpdate(adminId, { $push: { users: newUser._id } });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
