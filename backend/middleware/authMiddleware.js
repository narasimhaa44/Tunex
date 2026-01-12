// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');

// const authenticateAccessToken = (req, res, next) => {
//   try {
//     const token = req.cookies?.accessToken;
//     if (!token) return res.status(401).json({ error: 'No token' });

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
//       if (err) return res.status(401).json({ error: 'Invalid token' });
//       req.user = payload;
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { authenticateAccessToken };
// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateAccessToken = (req, res, next) => {
  try {
    // 1️⃣ Try cookie first (web)
    let token = req.cookies?.accessToken;

    // 2️⃣ Fallback to Authorization header (Android)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      req.user = payload; // { userId, username }
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticateAccessToken };
