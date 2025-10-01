const express = require('express');
const router = express.Router();
const store = require('../controllers/store');

router.post('/', store.createStore);
router.get('/', store.getStoresByPage);
router.delete('/:id', store.deleteStoreById);
router.get('/:userId', store.getStoreByUserId);
router.get('/:id', store.getStoreById);
router.get('/get/all', store.getAllStores);

module.exports = router;