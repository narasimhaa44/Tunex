const express = require('express');
const router = express.Router();
const { createAlbum, getAlbumById, addSongToAlbum, listAlbums } = require('../controllers/albumController');
const upload = require('../middleware/multer');

router.get('/', listAlbums);
router.get('/:id', getAlbumById);
router.post('/', upload.single('cover'), createAlbum);
router.post('/:id/add-song', addSongToAlbum);

module.exports = router;
