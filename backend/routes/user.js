const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateAccessToken } = require('../middleware/authMiddleware');

router.get('/liked-songs', authenticateAccessToken, userController.getLikedSongs);
router.post('/like-song', authenticateAccessToken, userController.toggleLikeSong);
router.get('/liked-albums', authenticateAccessToken, userController.getLikedAlbums);
router.post('/like-album', authenticateAccessToken, userController.toggleLikeAlbum);

module.exports = router;
