import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMusicNote, MdRadio, MdHeadphones, MdSunny, MdDarkMode } from "react-icons/md";
import styles from "./CoverPage.module.css";

const CoverPage = () => {
    const [exitX, setExitX] = useState(false);   // X animation only after button click
    const [isDark, setIsDark] = useState(true);

    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const handleStart = () => {
        setExitX(true);   // Trigger the X animation

        setTimeout(() => {
            navigate("/login");
        }, 1800); // animation duration
    };

    return (
        <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>

            {/* X Animation only when clicking "Start Listening" */}
            {exitX && (
                <div className={styles.xContainer}>
                    <div className={styles.xAnimated}>X</div>
                </div>
            )}

            {/* MAIN CONTENT — visible immediately */}
            {!exitX && (
                <>
                    <div className={styles.content}>

                        <div className={styles.header}>
                            <h1 className={styles.title}>Tune</h1>
                            <span className={styles.titleX}>X</span>
                        </div>

                        <div className={styles.tagline}>
                            <p>Your Music. Your Vibe. Your Way.</p>
                        </div>

                        <div className={styles.imageSection}>
                            <img src="/img/logo.png" alt="Headphones" className={styles.headphones} />
                        </div>

                        <div className={styles.buttons}>
                            <button className={styles.buttonPrimary} onClick={handleStart}>
                                Start Listening
                            </button>
                            <button className={styles.buttonSecondary}>Learn More</button>
                        </div>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <MdMusicNote className={styles.featureIcon} />
                                <p>Unlimited Streams</p>
                            </div>

                            <div className={styles.feature}>
                                <MdRadio className={styles.featureIcon} />
                                <p>Personalized Playlists</p>
                            </div>

                            <div className={styles.feature}>
                                <MdHeadphones className={styles.featureIcon} />
                                <p>Premium Quality</p>
                            </div>
                        </div>
                    </div>

                    <button className={styles.toggleBtn} onClick={toggleTheme}>
                        {isDark ? <MdSunny size={24} /> : <MdDarkMode size={24} />}
                    </button>
                </>
            )}
        </div>
    );
};

export default CoverPage;
