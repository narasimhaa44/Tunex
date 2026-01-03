const Album = require('../models/Album');
const Song = require('../models/Song');

module.exports.listAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json({ ok: true, albums });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to list albums' });
  }
};

const cloudinary = require('../utils/cloudinary');

module.exports.createAlbum = async (req, res) => {
  try {
    const { title, description, releaseDate, songs } = req.body;
    let coverUrl = '';
    let songIds = [];

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tunex/albums'
      });
      coverUrl = result.secure_url;
    }

    if (songs) {
      try {
        songIds = JSON.parse(songs);
      } catch (e) {
        console.error("Error parsing songs:", e);
      }
    }

    const album = await Album.create({ title, description, coverUrl, releaseDate, songs: songIds });
    res.json({ ok: true, album });
  } catch (err) {
    console.error("Create album error:", err);
    res.status(500).json({ ok: false, message: 'Create album failed' });
  }
};

// get album with populated songs
module.exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate({
      path: 'songs',
      select: 'title artist duration coverUrl audioUrl actors'
    });
    if (!album) return res.status(404).json({ ok: false, message: 'Album not found' });
    res.json({ ok: true, album });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Fetch album failed' });
  }
};

// add a song to album (and set song.album)
module.exports.addSongToAlbum = async (req, res) => {
  try {
    const { songId } = req.body;
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ ok: false, message: 'Album not found' });

    // attach song
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ ok: false, message: 'Song not found' });

    song.album = album._id;
    await song.save();

    // keep album.songs in sync (optional)
    if (!album.songs.includes(song._id)) {
      album.songs.push(song._id);
      await album.save();
    }

    res.json({ ok: true, album, song });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Add song failed' });
  }
};
// delete album
module.exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ ok: false, message: 'Album not found' });
    res.json({ ok: true, message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Delete album failed' });
  }
};
