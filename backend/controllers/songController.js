// const cloudinary = require("../utils/cloudinary");
// const Song = require("../models/Song");

// module.exports.uploadSong = async (req, res) => {
//     try {
//         // DEBUG LOGS — always add these first  
//         console.log("FILES RECEIVED:", req.files);
//         console.log("BODY RECEIVED:", req.body);

//         const { title, artist, duration } = req.body;

//         if (!req.files || !req.files.audio || !req.files.cover) {
//             console.log("Missing files in request");
//             return res.status(400).json({ message: "Audio and cover required" });
//         }

//         // AUDIO FILE  
//         const audioFile = req.files.audio[0];
//         console.log("Audio File:", audioFile);

//         // COVER FILE
//         const coverFile = req.files.cover[0];
//         console.log("Cover File:", coverFile);

//         // Upload audio to Cloudinary
//         const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
//             resource_type: "video",    // IMPORTANT for audio/mp3
//             folder: "tunex/audio"
//         });

//         // Upload cover to Cloudinary
//         const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
//             folder: "tunex/cover"
//         });

//         // Save in MongoDB
//         const song = await Song.create({
//             title,
//             artist,
//             duration,
//             audioUrl: audioUpload.secure_url,
//             coverUrl: coverUpload.secure_url,
//             uploadedBy: req.user.userId
//         });

//         return res.json({
//             ok: true,
//             message: "Upload successful",
//             song
//         });

//     } catch (error) {
//         console.log("UPLOAD ERROR:", error);
//         return res.status(500).json({ message: "Upload failed" });
//     }
// };
const cloudinary = require("../utils/cloudinary");
const Song = require("../models/Song");

module.exports.uploadSong = async (req, res) => {
    try {
        console.log("FILES RECEIVED:", req.files);
        console.log("BODY RECEIVED:", req.body);

        const { title, artist, duration } = req.body;

        if (!req.files || !req.files.audio || !req.files.cover) {
            return res.status(400).json({ message: "Audio and cover required" });
        }

        const audioFile = req.files.audio[0];
        const coverFile = req.files.cover[0];

        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video",
            folder: "tunex/audio"
        });

        const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
            folder: "tunex/cover"
        });

        const song = await Song.create({
            title,
            artist,
            duration,
            audioUrl: audioUpload.secure_url,
            coverUrl: coverUpload.secure_url,
            uploadedBy: req.user.userId
        });

        res.json({ ok: true, song });

    } catch (error) {
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

// ▶ NEW: GET ALL SONGS
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

// controllers/songController.js
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
