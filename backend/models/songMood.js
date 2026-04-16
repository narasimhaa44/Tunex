const mongoose = require("mongoose");

const songMoodSchema = new mongoose.Schema({
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0.5
  }
});

module.exports = mongoose.model("SongMood", songMoodSchema);