
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // dev
      "https://tunex-x65w.onrender.com"      // production frontend
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(require('path').join(__dirname, "uploads")));
app.use("/api/songs", songRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/albums', require('./routes/album'));
app.use('/api/actors', require('./routes/actor'));
app.use('/api/playlists', require('./routes/playlist'));
app.use('/api/user', require('./routes/user'));

// protected test
app.get('/api/protected', (req, res) => {
  res.json({ ok: true, msg: 'Public route' });
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
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => console.error('DB connect error', err));
