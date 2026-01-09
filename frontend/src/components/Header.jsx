import styles from "./Header.module.css";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import axios from "axios";
import { useAuth } from "./AuthContext";
import SettingsPanel from "./SettingsPanel";

axios.defaults.withCredentials = true;

const Header = ({ searchQuery, setSearchQuery }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState("dark");
    const { user } = useAuth();
    const [openSettings, setOpenSettings] = useState(false);

    const dropdownRef = useRef(null); // ⭐ NEW

    useEffect(() => {
        document.body.classList.add("dark-theme");
    }, []);

    // ⭐ CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSignOut = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`);
            window.location.href = "/login";
        } catch {
            console.log("Logout failed");
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        if (newTheme === "dark") document.body.classList.add("dark-theme");
        else document.body.classList.remove("dark-theme");
    };

    return (
        <>
            {openSettings && <SettingsPanel onClose={() => setOpenSettings(false)} />}

            <div className={styles.header}>
                <div className={styles.logo}>
                    <img src="/img/logo.png" alt="logo" className={styles.log} />
                    <p className={styles.name}>TuneX</p>
                </div>

                <div className={styles.right}>
                    <div className={styles.search}>
                        <CiSearch />
                        <input
                            type="text"
                            placeholder="Search"
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.profile}>
                        <div className="dropdown text-end" ref={dropdownRef}> {/* ⭐ ATTACH REF */}
                            <a
                                href="#"
                                className={`d-block link-body-emphasis text-decoration-none ${isOpen ? "show" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown();
                                }}
                            >
                                <img
                                    src={user?.avatar || "/img/profile.png"}
                                    alt="profile"
                                    className={styles.profileImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/img/profile.png";
                                        console.error("Error loading profile image:", user?.avatar);
                                    }}
                                />
                            </a>

                            <ul
                                className={`dropdown-menu ${isOpen ? "show" : ""}`}
                                style={
                                    isOpen
                                        ? {
                                            position: "absolute",
                                            inset: "0px 0px auto auto",
                                            margin: 0,
                                            transform: "translate3d(0px, 34px, 0px)",
                                        }
                                        : {}
                                }
                            >
                                <li>
                                    <button
                                        className="dropdown-item d-flex align-items-center gap-2"
                                        onClick={toggleTheme}
                                    >
                                        {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
                                        {theme === "light" ? "Dark Theme" : "Light Theme"}
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => setOpenSettings(true)}
                                    >
                                        Profile / Settings
                                    </button>
                                </li>

                                <li><hr className="dropdown-divider" /></li>

                                <li>
                                    <button className="dropdown-item" onClick={handleSignOut}>
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
