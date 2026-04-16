
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const spotifyAuth = require("./routes/spotifyAuth");
const SongMood = require("./models/songMood");
const Song = require("./models/Song");
const app = express();

const options = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
};

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.use(cors({
  origin: [
    "https://tunex-x65w.onrender.com",
    "http://localhost:5173",
    "http://localhost",
    "http://10.0.2.2",
    "http://192.168.1.22:5173",
    "capacitor://localhost"
  ],
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());


const path = require('path');
// Serve uploads folder
const uploadDir = path.join(__dirname, "uploads");
console.log("Serving static files from:", uploadDir);
app.use("/uploads", express.static(uploadDir));
app.use("/api/songs", songRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/albums', require('./routes/album'));
app.use('/api/actors', require('./routes/actor'));
app.use('/api/playlists', require('./routes/playlist'));
app.use('/api/user', require('./routes/user'));
app.get('/api/protected', (req, res) => {
  res.json({ ok: true, msg: 'Public route' });
});

app.post("/feedback", async (req, res) => {
  const { songId, liked } = req.body;

  const update = liked ? 0.2 : -0.2;
  const resut = await SongMood.updateOne(
    { songId: new mongoose.Types.ObjectId(songId) }, // 🔥 FIX
    { $inc: { score: update } },
    { upsert: false }
  );

  console.log("Updated:", result);

  res.json({ ok: true });
});


app.get("/songs/:mood", async (req, res) => {
  const mood = String(req.params.mood || "").toLowerCase();
  const rawTags = String(req.query.tags || "");
  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  try {
    const moodFilter = { mood };
    if (tags.length) {
      moodFilter.tags = { $in: tags };
    }

    let moodSongs = await SongMood.find(moodFilter).sort({ score: -1 });
    if (tags.length && moodSongs.length === 0) {
      moodSongs = await SongMood.find({ mood }).sort({ score: -1 });
    }

    const songIds = moodSongs.map(s => s.songId);

    const songs = await Song.find({
      _id: { $in: songIds }
    });
    const sortedSongs = songIds.map(id =>
      songs.find(song => song._id.toString() === id.toString())
    );

    res.json(sortedSongs);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

// global error catch
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/tunexauth';

mongoose.connect(MONGO)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
  })
  .catch(err => console.error('DB connect error', err));