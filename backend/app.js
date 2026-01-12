
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');

const app = express();

const options = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
};
// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
// Middleware
// (CORS configured below)

  cors({
    origin: [
      "https://tunex-x65w.onrender.com",
      "http://localhost:5173",
      "http://localhost",
      "http://10.0.2.2",
      "http://192.168.1.22:5173",
      "capacitor://localhost"
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("🔥 HIT:", req.method, req.url);
  next();
});

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
    app.listen(PORT,"0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
  })
  .catch(err => console.error('DB connect error', err));

// mongoose.connect(MONGO)
//   .then(() => {
//     https.createServer(options, app).listen(PORT, "0.0.0.0", () => {
//       console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
//       console.log(`✅ HTTPS Server running at https://10.0.2.2:${PORT}`);
//     });
//   })
//   .catch(err => console.error("DB connect error", err));