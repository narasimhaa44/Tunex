const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true },
  avatar: { type: String },
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  likedAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
