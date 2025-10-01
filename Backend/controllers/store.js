const Store = require('../models/stores');

exports.createStore =  async (req, res) => {
    try {
        console.log(req.body);
        const store = new Store(req.body);
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStoresByPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalStores = await Store.countDocuments();
        const totalPages = Math.ceil(totalStores / limit);

        const { name, address } = req.query;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (address) {
            filter.address = { $regex: address, $options: 'i' };
        }

        const stores = await Store.find(filter).skip(skip).limit(limit);
        res.json({ stores, totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findByIdAndDelete(id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStoreByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const store = await Store.find({ userId });
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


