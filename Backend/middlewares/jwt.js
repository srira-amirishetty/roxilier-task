const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      try {
        const user = await User.findById(decoded._id); 
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateJWT;