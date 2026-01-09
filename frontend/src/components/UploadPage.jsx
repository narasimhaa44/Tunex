import styles from "./UploadPage.module.css";
import { FaCloudUploadAlt, FaMusic, FaImage, FaUser, FaTimes } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

const UploadPage = ({ setSongs, songs }) => {
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        duration: ""
    });

    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const [audioPreview, setAudioPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // AUDIO FILE PICKER
    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAudioFile(file);
        setAudioPreview(file.name);

        const audio = new Audio(URL.createObjectURL(file));
        audio.onloadedmetadata = () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            setFormData((prev) => ({ ...prev, duration: formatted }));
        };
    };

    // COVER FILE PICKER
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCoverFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setCoverPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (type === "audio" && (file.type.startsWith("audio/") || file.type === "video/mpeg" || file.name.toLowerCase().endsWith(".mpeg"))) {
            setAudioFile(file);
            setAudioPreview(file.name);

            const audio = new Audio(URL.createObjectURL(file));
            audio.onloadedmetadata = () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
                setFormData((prev) => ({ ...prev, duration: formatted }));
            };
        }

        if (type === "cover" && file.type.startsWith("image/")) {
            setCoverFile(file);

            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const clearAudio = () => {
        setAudioFile(null);
        setAudioPreview(null);
    };

    const clearCover = () => {
        setCoverFile(null);
        setCoverPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.artist || !audioFile || !coverFile) {
            setMessage({ type: "error", text: "Please fill all fields and upload both files." });
            return;
        }

        setUploading(true);

        const fd = new FormData();
        fd.append("audio", audioFile);
        fd.append("cover", coverFile);
        fd.append("title", formData.title);
        fd.append("artist", formData.artist);
        fd.append("duration", formData.duration);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/songs/upload`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
                onUploadProgress: (prog) => {
                    const percent = Math.round((prog.loaded * 100) / prog.total);
                    setUploadProgress(percent);
                }
            });

            setMessage({ type: "success", text: "Song uploaded successfully!" });

            const newSong = {
                id: res.data.song._id,
                title: res.data.song.title,
                artist: res.data.song.artist,
                cover: res.data.song.coverUrl,
                audio: res.data.song.audioUrl,
                duration: res.data.song.duration
            };

            setSongs([...songs, newSong]);

        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Upload failed"
            });
        }

        setUploading(false);
    };

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.header}>
                <FaCloudUploadAlt className={styles.headerIcon} />
                <h1 className={styles.title}>Upload Your Music</h1>
                <p className={styles.subtitle}>Share your amazing tracks</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.uploadForm}>

                {/* SONG DETAILS */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Song Details</h3>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <FaMusic className={styles.labelIcon} /> Song Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            className={styles.input}
                            placeholder="Enter song title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <FaUser className={styles.labelIcon} /> Artist Name
                        </label>
                        <input
                            type="text"
                            name="artist"
                            className={styles.input}
                            placeholder="Enter artist name"
                            value={formData.artist}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* FILE UPLOADS */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Upload Files</h3>

                    <div className={styles.uploadGrid}>

                        {/* AUDIO UPLOAD */}
                        <div className={styles.uploadBox}>
                            <label className={styles.uploadLabel}>
                                <FaMusic className={styles.uploadIcon} /> Audio File
                            </label>

                            <div
                                className={styles.dropZone}
                                onDrop={(e) => handleDrop(e, "audio")}
                                onDragOver={handleDragOver}
                            >
                                {audioPreview ? (
                                    <div className={styles.preview}>
                                        <FaMusic className={styles.previewIcon} />
                                        <p>{audioPreview}</p>
                                        <button type="button" onClick={clearAudio} className={styles.clearBtn}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p>Drop audio here</p>
                                        <span>or</span>
                                        {/* FIXED BROWSE BUTTON */}
                                        <label className={styles.browseBtn}>
                                            Browse Audio
                                            <input
                                                type="file"
                                                accept="audio/*, .mpeg, .mp3"
                                                onChange={handleAudioChange}
                                                className={styles.fileInput}
                                            />
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* COVER UPLOAD */}
                        <div className={styles.uploadBox}>
                            <label className={styles.uploadLabel}>
                                <FaImage className={styles.uploadIcon} /> Cover Image
                            </label>

                            <div
                                className={styles.dropZone}
                                onDrop={(e) => handleDrop(e, "cover")}
                                onDragOver={handleDragOver}
                            >
                                {coverPreview ? (
                                    <div className={styles.preview}>
                                        <img src={coverPreview} className={styles.coverPreview} />
                                        <button type="button" onClick={clearCover} className={styles.clearBtn}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p>Drop image here</p>
                                        <span>or</span>

                                        <label className={styles.browseBtn}>
                                            Browse Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverChange}
                                                className={styles.fileInput}
                                            />
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* PROGRESS BAR */}
                {uploading && (
                    <div className={styles.progressSection}>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p>{uploadProgress}%</p>
                    </div>
                )}

                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={uploading}>
                    <FaCloudUploadAlt className={styles.btnIcon} />
                    Upload Song
                </button>

            </form>
        </div>
    );
};

export default UploadPage;
