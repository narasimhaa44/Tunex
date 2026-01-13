import { useState } from "react";
import { FaTimes, FaCamera } from "react-icons/fa";
import styles from "./AddArtistModal.module.css";
// import axios from "axios"; // Assuming axios is installed or use fetch

const AddArtistModal = ({ isOpen, onClose, onArtistAdded }) => {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [stats, setStats] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("bio", bio);
            formData.append("stats", stats);
            if (image) {
                formData.append("image", image);
            }

            const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

            const res = await fetch(`${API_BASE}/api/actors`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.ok) {
                onArtistAdded();
                onClose();
                // Reset form
                setName("");
                setBio("");
                setStats("");
                setImage(null);
                setPreview(null);
            } else {
                alert("Failed to add artist");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding artist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <FaTimes />
                </button>
                <h2>Add New Artist</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.imageUpload}>
                        <label htmlFor="artist-image">
                            {preview ? (
                                <img src={preview} alt="Preview" className={styles.previewImage} />
                            ) : (
                                <div className={styles.placeholder}>
                                    <FaCamera size={24} />
                                    <span>Upload Photo</span>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="artist-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Anirudh Ravichandran"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Stats</label>
                        <input
                            type="text"
                            value={stats}
                            onChange={(e) => setStats(e.target.value)}
                            placeholder="Monthly Listeners: 12M"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Brief description..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? "Adding..." : "Add Artist"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddArtistModal;
