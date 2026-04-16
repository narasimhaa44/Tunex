const cloudinary = require("../utils/cloudinary");
const Song = require("../models/Song");
const SongMood = require("../models/songMood");
const axios = require("axios");

// 🔥 UPLOAD SONG (UPDATED - NON BLOCKING ML)
module.exports.uploadSong = async (req, res) => {
    try {
        const { title, artist, duration } = req.body;

        if (!req.files || !req.files.audio || !req.files.cover) {
            return res.status(400).json({ message: "Audio and cover required" });
        }

        const audioFile = req.files.audio[0];
        const coverFile = req.files.cover[0];

        // 🔥 Upload to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video",
            folder: "tunex/audio"
        });

        const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
            folder: "tunex/cover"
        });

        // 🔥 Save song in DB
        const song = await Song.create({
            title,
            artist,
            duration,
            audioUrl: audioUpload.secure_url,
            coverUrl: coverUpload.secure_url,
            uploadedBy: req.user.userId
        });

        // ✅ INSTANT RESPONSE (NO WAIT)
        res.json({ ok: true, song });

        // ============================
        // 🔥 BACKGROUND ML PROCESSING
        // ============================
        axios.post(`${process.env.ML_API_URL}/predict`, {
            audioUrl: audioUpload.secure_url
        })
            .then(async (mlRes) => {
                console.log("ML RESPONSE:", mlRes.data);

                const mood = mlRes.data.mood;

                const tagMap = {
                    chill: ["smooth", "peaceful", "soothing"],
                    gym: ["fast", "energetic", "beats"],
                    love: ["romantic", "soulful"],
                    sad: ["emotional", "moody", "nostalgia"],
                    motivation: ["energetic", "uplifting"],
                    party: ["dance", "fun", "beats"]
                };

                const tags = tagMap[mood] || [];

                // 🔥 SAVE / UPDATE MOOD
                await SongMood.updateOne(
                    { songId: song._id },
                    {
                        $set: {
                            songId: song._id,
                            mood,
                            tags,
                            score: 0.5
                        }
                    },
                    { upsert: true }
                );

                console.log("✅ Mood saved:", mood);
            })
            .catch(err => {
                console.log("❌ ML FAILED:", err.message);
            });

    } catch (error) {
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

// ▶ GET ALL SONGS
module.exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });

        res.json({
            ok: true,
            songs
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch songs" });
    }
};

// ▶ ADD ACTOR TO SONG
module.exports.addActorToSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });

        const { actorId } = req.body;

        if (!song.actors.includes(actorId)) {
            song.actors.push(actorId);
            await song.save();
        }

        res.json({ ok: true, song });

    } catch (err) {
        res.status(500).json({ message: 'Failed' });
    }
};

// ▶ GET SONGS BY MOOD
module.exports.getSongsByMood = async (req, res) => {
    try {
        const { mood } = req.params;

        const moodSongs = await SongMood.find({ mood });
        const songIds = moodSongs.map(s => s.songId);

        const songs = await Song.find({
            _id: { $in: songIds }
        });

        res.json(songs);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
    }
};