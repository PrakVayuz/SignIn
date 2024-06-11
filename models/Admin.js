const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
