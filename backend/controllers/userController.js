const User = require('../models/User');

// Get liked songs
exports.getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('likedSongs');
    res.status(200).json({ success: true, likedSongs: user.likedSongs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle like song
exports.toggleLikeSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user.likedSongs) user.likedSongs = []; // Initialize if missing

    const isLiked = user.likedSongs.some(id => id.toString() === songId);

    if (isLiked) {
      user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();

    res.status(200).json({ success: true, isLiked: !isLiked, likedSongs: user.likedSongs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get liked albums
exports.getLikedAlbums = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('likedAlbums');
    res.status(200).json({ success: true, likedAlbums: user.likedAlbums || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle like album
exports.toggleLikeAlbum = async (req, res) => {
  try {
    const { albumId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user.likedAlbums) user.likedAlbums = [];

    const isLiked = user.likedAlbums.some(id => id.toString() === albumId);

    if (isLiked) {
      user.likedAlbums = user.likedAlbums.filter(id => id.toString() !== albumId);
    } else {
      user.likedAlbums.push(albumId);
    }

    await user.save();

    res.status(200).json({ success: true, isLiked: !isLiked, likedAlbums: user.likedAlbums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
