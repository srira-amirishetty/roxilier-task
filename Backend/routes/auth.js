const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const authenticateJWT = require('../middlewares/jwt');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/update-password', authenticateJWT, auth.updatePassword);
module.exports = router;