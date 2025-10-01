const admin = require('../controllers/admin');

const express = require('express');
const router = express.Router();

router.get('/users', admin.countAllUsers);
router.get('/stores', admin.countAllStores);
router.get('/ratings', admin.countAllRatings);
router.get('/users/list', admin.getUsers);
router.get('/users/names', admin.getAllUsersNames);
router.get('/users/all', admin.getAllUsers)
router.patch('/users/role/:id', admin.roleChange);

module.exports = router;