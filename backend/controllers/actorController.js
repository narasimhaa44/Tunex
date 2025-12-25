const Actor = require('../models/Actor');
const Song = require('../models/Song');

module.exports.createActor = async (req, res) => {
  try {
    const actor = await Actor.create(req.body);
    res.json({ ok: true, actor });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Create actor failed' });
  }
};

module.exports.listActors = async (req, res) => {
  try {
    const actors = await Actor.find().sort({ name: 1 });
    res.json({ ok: true, actors });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'List actors failed' });
  }
};

// get songs for actor (populate album optionally)
module.exports.getSongsByActor = async (req, res) => {
  try {
    const actorId = req.params.id;
    const songs = await Song.find({ actors: actorId }).populate('album', 'title coverUrl');
    res.json({ ok: true, songs });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Fetch songs failed' });
  }
};
