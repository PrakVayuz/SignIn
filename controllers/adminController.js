const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signInAdmin = async (req, res) => {
    try {

        console.log("Admin Chala");
        const { username, password } = req.body;
             
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
      console.log(admin);
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid username or password' });
          }
          
          const token = jwt.sign({ userId: admin._id, role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1h' });
          console.log(token);
        res.status(200).json({ message: 'Sign In successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

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


exports.getUsersByAdmin = async (req, res) => {
    try {
        const adminId = req.admin._id;

        const admin = await Admin.findById(adminId).populate('users');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ users: admin.users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};