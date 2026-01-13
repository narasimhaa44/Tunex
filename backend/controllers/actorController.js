const Actor = require('../models/Actor');
const Song = require('../models/Song');

module.exports.createActor = async (req, res) => {
  try {
    console.log("createActor called with body:", req.body);
    console.log("createActor file:", req.file);
    const { name, bio, stats } = req.body;
    let photoUrl = "";
    if (req.file) {
        // Construct URL based on where we are serving static files
        // app.js serves /uploads at /uploads
        photoUrl = `/uploads/avatars/${req.file.filename}`; 
    }

    const actor = await Actor.create({
        name,
        bio,
        stats,
        photoUrl
    });
    res.json({ ok: true, actor });
  } catch (err) {
    console.error("Create actor error:", err);
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
