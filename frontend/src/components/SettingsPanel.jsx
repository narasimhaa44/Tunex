import styles from "./SettingsPanel.module.css";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useState, useRef } from "react";
import { MdClose, MdEdit, MdCameraAlt } from "react-icons/md";

const SettingsPanel = ({ onClose }) => {
    const { user, setUser } = useAuth();

    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(user?.avatar || "/img/profile.png");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("displayName", displayName);
            if (password) formData.append("password", password);
            if (avatarFile) formData.append("avatar", avatarFile);

            const res = await axios.put(
                "https://tunex-15at.onrender.com/api/auth/update",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );

            setUser(res.data.user);
            setMessage("Profile updated successfully!");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setMessage("Update failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className={styles.closeIcon}>
                    <MdClose />
                </button>

                <h2 className={styles.title}>Edit Profile</h2>

                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper} onClick={() => fileInputRef.current.click()}>
                        <img
                            src={preview}
                            alt="Profile"
                            className={styles.avatar}
                            onError={(e) => { e.target.src = "/img/profile.png"; }}
                        />
                        <div className={styles.overlay}>
                            <MdCameraAlt />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        hidden
                        accept="image/*"
                    />
                    <p className={styles.changePhotoText}>Change Photo</p>
                </div>

                <div className={styles.formGroup}>
                    <label>Display Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className={styles.input}
                        placeholder="Your Name"
                    />
                </div>

                <div className={styles.divider}></div>
                <h3 className={styles.subTitle}>Change Password</h3>

                <div className={styles.formGroup}>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        placeholder="Leave blank to keep current"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        placeholder="Confirm new password"
                    />
                </div>

                {message && <p className={message.includes("failed") || message.includes("match") ? styles.errorMsg : styles.successMsg}>{message}</p>}

                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                    <button onClick={handleSave} className={styles.saveBtn} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
