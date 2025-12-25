const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authenticateAccessToken } = require('../middleware/authMiddleware');

router.post('/create', authenticateAccessToken, playlistController.createPlaylist);
router.get('/my-playlists', authenticateAccessToken, playlistController.getUserPlaylists);
router.post('/add-song', authenticateAccessToken, playlistController.addSongToPlaylist);
router.get('/:id', authenticateAccessToken, playlistController.getPlaylist);

module.exports = router;
