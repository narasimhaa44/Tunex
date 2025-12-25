// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, me, refreshToken, logout,updateUser } = require('../controllers/authController');
const { authenticateAccessToken } = require('../middleware/authMiddleware');
const upload = require("../middleware/upload");
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// example protected route using cookie access token
router.get('/me', authenticateAccessToken, me);
router.put("/update", authenticateAccessToken, upload.single("avatar"), updateUser);

module.exports = router;
