// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateAccessToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ error: 'No token' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      req.user = payload;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticateAccessToken };
