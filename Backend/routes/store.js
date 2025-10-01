const express = require('express');
const router = express.Router();
const store = require('../controllers/store');
const authenticateJWT = require('../middlewares/jwt');

router.post('/', authenticateJWT, store.createStore);
router.get('/', authenticateJWT, store.getStoresByPage);
router.delete('/:id', authenticateJWT, store.deleteStoreById);
router.get('/:userId', authenticateJWT, store.getStoreByUserId);
router.get('/:id', authenticateJWT, store.getStoreById);
router.get('/get/all', authenticateJWT, store.getAllStores);

module.exports = router;