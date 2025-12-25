const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
  duration: String,
  coverUrl: String,
  audioUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
