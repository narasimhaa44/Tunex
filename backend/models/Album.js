// models/Album.js
const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  coverUrl: String,         // album art (can be Cloudinary URL)
  releaseDate: Date,
  // optional: store song ids (but you can also query songs by album)
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Album', AlbumSchema);
