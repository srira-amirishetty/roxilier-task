const User = require('../models/users');
const Store = require('../models/stores');
const Rating = require('../models/ratings');

exports.countAllUsers = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to count users.' });
    }
};

exports.countAllStores = async (req, res) => {
    try {
        const count = await Store.countDocuments();
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to count stores.' });
    }
};

exports.countAllRatings = async (req, res) => {
    try {
        const count = await Rating.countDocuments();
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to count ratings.' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { page = 1, name, email, address, role } = req.query;
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };
        if (address) query.address = { $regex: address, $options: 'i' };
        if (role) query.role = role;

        const limit = 10;
        const skip = (parseInt(page) - 1) * limit;

        const users = await User.find(query).skip(skip).limit(limit);
        const total = await User.countDocuments(query);

        res.status(200).json({
            users,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users.' });
    }
};

exports.getAllUsersNames = async (req, res) => {
    try {
        const users = await User.find({}, 'username _id'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user names.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users.' });
    }
};

exports.roleChange = async (req, res) => {
    try {
        const { id } = req.params;

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const newRole = user.role === 'user' ? 'shopOwner' : 'user';

         user = await User.findByIdAndUpdate(id, { role: newRole }, { new: true });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to change user role.' });
    }
};
