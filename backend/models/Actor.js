// models/Actor.js
const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  photoUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Actor', ActorSchema);
