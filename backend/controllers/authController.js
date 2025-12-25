// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ACCESS_EXPIRES = '15m';     // short lived access token
const REFRESH_EXPIRES = '7d';     // refresh token lifetime

const createAccessToken = (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRES });
const createRefreshToken = (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES });

// const cookieOptions = (isProduction=false) => ({
//   httpOnly: true,
//   secure: isProduction,         // set true in production (HTTPS)
//   sameSite: 'lax',
//   // path default is '/', leave as is
// });
const cookieOptions = (isProduction = false) => ({
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "lax",
  path: "/",   // <-- IMPORTANT
});


module.exports.register = async (req, res, next) => {
  try {
    const { username, password, displayName } = req.body;
    if (!username || !password || !displayName)
      return res.status(400).json({ error: 'Missing fields' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username taken' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate profile avatar
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

    const user = await User.create({
      username,
      passwordHash,
      displayName,
      avatar,
    });

    res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      }
    });
  } catch (err) { next(err); }
};


module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { userId: user._id, username: user.username };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    const isProd = process.env.NODE_ENV === 'production';

    // set cookies (httpOnly)
    res.cookie('accessToken', accessToken, { ...cookieOptions(isProd), maxAge: 15 * 60 * 1000 }); // 15m
    res.cookie('refreshToken', refreshToken, { ...cookieOptions(isProd), maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7d

    res.json({
  ok: true,
  user: {
    id: user._id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar
  }
});

  } catch (err) { console.log(err);
    next(err); }
};

module.exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const isProd = process.env.NODE_ENV === 'production';

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return res.status(401).json({ error: 'Invalid refresh token' });

      const newAccess = createAccessToken({ userId: payload.userId, username: payload.username });
      res.cookie('accessToken', newAccess, { ...cookieOptions(isProd), maxAge: 15 * 60 * 1000 });
      res.json({ ok: true });
    });
  } catch (err) { next(err); }
};

module.exports.logout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('accessToken', cookieOptions(isProd));
    res.clearCookie('refreshToken', cookieOptions(isProd));
    res.json({ ok: true });
  } catch (err) { next(err); }
};


module.exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      }
    });
  } catch (err) { next(err); }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.body.displayName) {
      user.displayName = req.body.displayName;
    }

    if (req.file) {
      user.avatar = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};
