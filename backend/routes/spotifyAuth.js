const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust path if needed
const bcrypt = require("bcryptjs");

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://127.0.0.1:5000/api/auth/spotify/callback";

// STEP 1: Redirect to Spotify
router.get("/spotify", (req, res) => {
  const scope = "streaming user-read-email user-read-private";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
      })
  );
});

// STEP 2: Callback
router.get("/spotify/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // 🔥 1️⃣ Exchange code for access token
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );

    const { access_token } = response.data;

    // 🔥 2️⃣ Get Spotify user profile
    const profile = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const spotifyUser = profile.data;

    // 🔥 3️⃣ Find or create user in DB
    let user = await User.findOne({ spotifyId: spotifyUser.id });

if (!user) {
  const dummyPassword = await bcrypt.hash(
    spotifyUser.id + process.env.JWT_SECRET,
    10
  );

  user = await User.create({
    username: spotifyUser.display_name || spotifyUser.email,
    displayName: spotifyUser.display_name || spotifyUser.email,
    email: spotifyUser.email,
    spotifyId: spotifyUser.id,
    avatar: spotifyUser.images?.[0]?.url || "",
    passwordHash: dummyPassword,
  });
}



    // 🔥 4️⃣ Generate YOUR APP JWT
    const appToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 5️⃣ Redirect back to frontend
    const refreshToken = response.data.refresh_token || "";
    res.redirect(
      `http://localhost:5173/spotify-success?token=${appToken}&spotify_token=${access_token}&refresh_token=${refreshToken}`
    );

  } catch (err) {
    console.error("Spotify Auth Error:", err.response?.data || err.message);
    res.send("Spotify authentication failed");
  }
});

module.exports = router;
