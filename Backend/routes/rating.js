const express = require('express');
const router = express.Router();
const rating = require('../controllers/rating');
const authenticateJWT = require('../middlewares/jwt');

router.post('/:userId/:storeId', authenticateJWT, rating.createRating);
router.get('/:storeId',authenticateJWT, rating.getRatingsByStoreId);
router.put('/:userId/:storeId',authenticateJWT, rating.editRatingByUserAndStore);
router.delete('/:userId/:storeId',authenticateJWT, rating.deleteRatingById);
router.get('/:storeId', authenticateJWT, rating.getUsersByStoreId);
router.get('/:userId/:storeId',authenticateJWT, rating.getRatingByStoreIdAndUserId);

module.exports = router;