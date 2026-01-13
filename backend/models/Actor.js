// models/Actor.js
const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  stats: String, // e.g. "Monthly Listeners: 12M"
  photoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Actor', ActorSchema);
