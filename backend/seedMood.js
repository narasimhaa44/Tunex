require("dotenv").config();
const mongoose = require("mongoose");

const Song = require("./models/Song");
const SongMood = require("./models/songMood");

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/tunexauth";

const moods = [
  "love",
  "sad",
  "chill",
  "party",
  "gym",
  "motivation",
  "focus",
  "devotional",
  "travel"
];

async function seed() {
  await mongoose.connect(MONGO);

  const songs = await Song.find();

  for (let song of songs) {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    await SongMood.create({
      songId: song._id,
      mood: randomMood,
      score: 0.5
    });
  }

  console.log("✅ songMood filled!");
  process.exit();
}

seed();