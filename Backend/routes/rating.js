const express = require('express');
const router = express.Router();
const rating = require('../controllers/rating');

router.post('/:userId/:storeId', rating.createRating);
router.get('/:storeId', rating.getRatingsByStoreId);
router.put('/:userId/:storeId', rating.editRatingByUserAndStore);
router.delete('/:userId/:storeId', rating.deleteRatingById);
router.get('/:storeId', rating.getUsersByStoreId);
router.get('/:userId/:storeId', rating.getRatingByStoreIdAndUserId);

module.exports = router;