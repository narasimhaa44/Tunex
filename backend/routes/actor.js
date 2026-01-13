const express = require('express');
const router = express.Router();
const { createActor, listActors, getSongsByActor } = require('../controllers/actorController');
const upload = require('../middleware/upload');

router.get('/', listActors);
router.post('/', upload.single('image'), createActor);
router.get('/:id/songs', getSongsByActor);

module.exports = router;
