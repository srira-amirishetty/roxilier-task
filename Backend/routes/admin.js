const admin = require('../controllers/admin');
const express = require('express');
const authenticateJWT = require('../middlewares/jwt');
const router = express.Router();

router.get('/users', authenticateJWT, admin.countAllUsers);
router.get('/stores', authenticateJWT, admin.countAllStores);
router.get('/ratings', authenticateJWT, admin.countAllRatings);
router.get('/users/list', authenticateJWT, admin.getUsers);
router.get('/users/names', authenticateJWT, admin.getAllUsersNames);
router.get('/users/all', authenticateJWT, admin.getAllUsers);
router.patch('/users/role/:id', authenticateJWT, admin.roleChange);

module.exports = router;