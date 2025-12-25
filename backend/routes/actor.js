const express = require('express');
const router = express.Router();
const { createActor, listActors, getSongsByActor } = require('../controllers/actorController');

router.get('/', listActors);
router.post('/', createActor);
router.get('/:id/songs', getSongsByActor);

module.exports = router;
