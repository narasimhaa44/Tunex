const Playlist = require('../models/Playlist');
const User = require('../models/User');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    const newPlaylist = new Playlist({
      title,
      description,
      owner: userId,
      songs: []
    });

    await newPlaylist.save();

    // Add to user's playlists
    await User.findByIdAndUpdate(userId, { $push: { playlists: newPlaylist._id } });

    res.status(201).json({ success: true, playlist: newPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all playlists for the current user
exports.getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.userId;
    const playlists = await Playlist.find({ owner: userId }).populate('songs');
    res.status(200).json({ success: true, playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a song to a playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.user.userId;

    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.songs.some(id => id.toString() === songId)) {
      return res.status(400).json({ success: false, message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific playlist
exports.getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate('songs');
    
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
