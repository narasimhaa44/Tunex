const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { authenticateAccessToken } = require("../middleware/authMiddleware");
const { uploadSong, getAllSongs } = require("../controllers/songController");

router.post(
    "/upload",
    authenticateAccessToken,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "cover", maxCount: 1 }
    ]),
    uploadSong
);

router.get(
    "/all",
    authenticateAccessToken,
    getAllSongs
);


module.exports = router;
