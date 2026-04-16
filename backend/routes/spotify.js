// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const NodeCache = require('node-cache');
// const { getSpotifyToken } = require('../utils/spotifyToken');

// const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// /*
// ===========================================================
// FETCH ARTIST SONGS (STABLE ALBUMS METHOD)
// ===========================================================
// */
// router.get('/artist/:name', async (req, res) => {
//     try {
//         const artistName = req.params.name?.trim();

//         if (!artistName) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Artist name required"
//             });
//         }

//         const cacheKey = `spotify_artist_${artistName.toLowerCase()}`;
//         const cached = cache.get(cacheKey);

//         if (cached) {
//             console.log("Returning cached data for:", artistName);
//             return res.json({ success: true, songs: cached });
//         }

//         console.log("Fetching Spotify albums-based data for:", artistName);

//         const token = await getSpotifyToken();

//         if (!token) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to generate Spotify token"
//             });
//         }

//         // 🔥 STEP 1: SEARCH ARTIST
//         const searchRes = await axios.get(
//             'https://api.spotify.com/v1/search',
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: {
//                     q: artistName,
//                     type: 'artist',
//                     limit: 1
//                 }
//             }
//         );

//         if (!searchRes.data.artists.items.length) {
//             return res.json({
//                 success: false,
//                 message: "Artist not found"
//             });
//         }

//         const artistId = searchRes.data.artists.items[0].id;
//         console.log("Artist ID:", artistId);

//         // 🔥 STEP 2: GET ARTIST ALBUMS
//         const albumsRes = await axios.get(
//             `https://api.spotify.com/v1/artists/${artistId}/albums`,
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: {
//                     include_groups: 'album,single',
//                     market: 'US',
//                     limit: 5
//                 }
//             }
//         );

//         const albums = albumsRes.data.items;

//         if (!albums.length) {
//             return res.json({
//                 success: true,
//                 songs: []
//             });
//         }

//         // 🔥 STEP 3: GET TRACKS FROM EACH ALBUM
//         let allTracks = [];

//         for (const album of albums) {
//             const albumTracksRes = await axios.get(
//                 `https://api.spotify.com/v1/albums/${album.id}/tracks`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             );

//             const tracks = albumTracksRes.data.items.map(track => ({
//                 _id: track.id,
//                 title: track.name,
//                 artist: track.artists.map(a => a.name).join(', '),
//                 album: album.name,
//                 coverUrl: album.images?.[0]?.url || null,
//                 audioUrl: track.preview_url,
//                 duration: Math.floor(track.duration_ms / 1000),
//                 isSpotify: true
//             }));

//             allTracks.push(...tracks);
//         }
// console.log("Total tracks before filter:", allTracks.length);

//         // 🔥 STEP 4: Remove Duplicates + Remove No Preview
//         const uniqueTracks = [];
//         const seen = new Set();

//         for (const track of allTracks) {
//             if (!seen.has(track._id)) {
//                 seen.add(track._id);
//                 uniqueTracks.push(track);
//             }
//         }

//         // Cache result
//         cache.set(cacheKey, uniqueTracks);

//         return res.json({
//             success: true,
//             songs: uniqueTracks
//         });

//     } catch (error) {
//         console.log("SPOTIFY ALBUM METHOD ERROR:");
//         console.log(error.response?.status);
//         console.log(error.response?.data || error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch artist songs"
//         });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');
const { getSpotifyToken } = require('../utils/spotifyToken');

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

/*
===========================================================
FETCH ARTIST SONGS (STABLE ALBUMS METHOD)
===========================================================
*/
// router.get('/artist/:name', async (req, res) => {
//     try {
//         const artistName = req.params.name?.trim();

//         if (!artistName) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Artist name required"
//             });
//         }

//         const cacheKey = `spotify_artist_${artistName.toLowerCase()}`;
//         const cached = cache.get(cacheKey);

//         if (cached) {
//             console.log("Returning cached data for:", artistName);
//             return res.json({ success: true, songs: cached });
//         }

//         console.log("Fetching Spotify albums-based data for:", artistName);

//         const token = await getSpotifyToken();

//         if (!token) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to generate Spotify token"
//             });
//         }

//         // 🔥 STEP 1: SEARCH ARTIST
//         const searchRes = await axios.get(
//             'https://api.spotify.com/v1/search',
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: {
//                     q: artistName,
//                     type: 'artist',
//                     limit: 1
//                 }
//             }
//         );

//         if (!searchRes.data.artists.items.length) {
//             return res.json({
//                 success: false,
//                 message: "Artist not found"
//             });
//         }

//         const artistId = searchRes.data.artists.items[0].id;
//         console.log("Artist ID:", artistId);

//         // 🔥 STEP 2: GET ARTIST ALBUMS
//         const albumsRes = await axios.get(
//             `https://api.spotify.com/v1/artists/${artistId}/albums`,
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: {
//                     include_groups: 'album,single',
//                     market: 'US',
//                     limit: 5
//                 }
//             }
//         );

//         const albums = albumsRes.data.items;

//         if (!albums.length) {
//             return res.json({
//                 success: true,
//                 songs: []
//             });
//         }

//         // 🔥 STEP 3: GET TRACKS FROM EACH ALBUM
//         let allTracks = [];

//         for (const album of albums) {
//             const albumTracksRes = await axios.get(
//                 `https://api.spotify.com/v1/albums/${album.id}/tracks`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             );

//             const tracks = albumTracksRes.data.items.map(track => ({
//                 _id: track.id,
//                 title: track.name,
//                 artist: track.artists.map(a => a.name).join(', '),
//                 album: album.name,
//                 coverUrl: album.images?.[0]?.url || null,
//                 audioUrl: track.preview_url,
//                 duration: Math.floor(track.duration_ms / 1000),
//                 isSpotify: true
//             }));

//             allTracks.push(...tracks);
//         }
// console.log("Total tracks before filter:", allTracks.length);

//         // 🔥 STEP 4: Remove Duplicates + Remove No Preview
//         const uniqueTracks = [];
//         const seen = new Set();

//         for (const track of allTracks) {
//             if (!seen.has(track._id)) {
//                 seen.add(track._id);
//                 uniqueTracks.push(track);
//             }
//         }

//         // Cache result
//         cache.set(cacheKey, uniqueTracks);

//         return res.json({
//             success: true,
//             songs: uniqueTracks
//         });

//     } catch (error) {
//         console.log("SPOTIFY ALBUM METHOD ERROR:");
//         console.log(error.response?.status);
//         console.log(error.response?.data || error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch artist songs"
//         });
//     }
// });
router.get("/artist-latest/:name", async (req, res) => {
  try {
    const artistName = req.params.name?.trim();
    if (!artistName) {
      return res.status(400).json({
        success: false,
        message: "Artist name required"
      });
    }

    const token = await getSpotifyToken();

    // 🔥 1️⃣ SEARCH ARTIST
    const searchRes = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: artistName,
          type: "artist",
          limit: 1
        }
      }
    );

    const artist = searchRes.data.artists.items[0];

    if (!artist) {
      return res.json({
        success: false,
        message: "Artist not found"
      });
    }

    // 🔥 2️⃣ GET ALBUMS (Latest First)
    const albumsRes = await axios.get(
      `https://api.spotify.com/v1/artists/${artist.id}/albums`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          include_groups: "album,single",
          market: "US",
          limit: 10
        }
      }
    );

    let albums = albumsRes.data.items;

    // 🔥 Remove duplicate albums (Spotify returns duplicates sometimes)
    const uniqueAlbums = [];
    const albumNames = new Set();

    for (const album of albums) {
      if (!albumNames.has(album.name)) {
        albumNames.add(album.name);
        uniqueAlbums.push(album);
      }
    }

    // 🔥 Sort by release date (newest first)
    uniqueAlbums.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );

    let allTracks = [];
    const seenTracks = new Set();

    // 🔥 3️⃣ GET TRACKS FROM LATEST 5 ALBUMS
    for (const album of uniqueAlbums.slice(0, 5)) {
      const tracksRes = await axios.get(
        `https://api.spotify.com/v1/albums/${album.id}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      for (const track of tracksRes.data.items) {

        // Remove duplicates
        if (seenTracks.has(track.id)) continue;
        seenTracks.add(track.id);

        allTracks.push({
          id: track.id,
          title: track.name,
          artist: track.artists.map(a => a.name).join(", "),
          album: album.name,
          coverUrl: album.images?.[0]?.url || null,
          uri: track.uri,
          releaseDate: album.release_date
        });
      }
    }

    return res.json({
      success: true,
      songs: allTracks
    });

  } catch (err) {
    console.error("Artist Latest Error:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest songs"
    });
  }
});
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query required"
      });
    }

    const token = await getSpotifyToken();

    const searchRes = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: "track",
          limit: 10,
          market: "US"
        }
      }
    );

    const tracks = searchRes.data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      coverUrl: track.album.images?.[0]?.url || null,
      uri: track.uri
    }));

    res.json({ success: true, songs: tracks });

  } catch (err) {
    console.error("Search Error:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});


module.exports = router;
