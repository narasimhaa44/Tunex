import styles from "./MusicPlayer.module.css";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom } from "react-icons/fa";
import { MdQueueMusic } from "react-icons/md";
import { useState } from "react";

const MusicPlayer = ({ currentSong, setCurrentSong, isPlaying, setIsPlaying, songs, progress, currentTime, duration, audioRef, playNextSong, playPreviousSong, isShuffle, setIsShuffle, queue, setQueue, showQueue, setShowQueue }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };



    const handleProgressBarClick = (e) => {
        const progressBar = e.currentTarget;
        const audio = audioRef.current;
        if (!progressBar || !audio) return;

        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const newTime = percentage * audio.duration;

        audio.currentTime = newTime;
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentSong) return null;

    return (
        <>
            {/* Mobile Modal Player */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={currentSong.cover} alt={currentSong.title} className={styles.modalCover} />
                        <div className={styles.modalInfo}>
                            <h2 className={styles.modalTitle}>{currentSong.title}</h2>
                            <p className={styles.modalArtist}>{currentSong.artist}</p>
                        </div>
                        <div className={styles.modalControls}>
                            <FaRandom
                                className={`${styles.modalControlIcon} ${isShuffle ? styles.active : ""}`}
                                onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                            />
                            <FaStepBackward className={styles.modalControlIcon} onClick={playPreviousSong} />
                            <div className={styles.modalPlayBtn} onClick={togglePlayPause}>
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </div>
                            <FaStepForward className={styles.modalControlIcon} onClick={playNextSong} />
                            <MdQueueMusic
                                className={`${styles.modalControlIcon} ${showQueue ? styles.active : ""}`}
                                onClick={(e) => { e.stopPropagation(); setShowQueue(!showQueue); }}
                            />
                        </div>
                        <div className={styles.modalProgressContainer}>
                            <span className={styles.timeText}>{formatTime(currentTime)}</span>
                            <div
                                className={styles.progressBar}
                                onClick={handleProgressBarClick}
                            >
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className={styles.timeText}>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Player Bar (Spotify Style) */}
            <div className={styles.playerBar}>
                <div className={styles.songInfo} onClick={() => setIsModalOpen(true)}>
                    <img src={currentSong.cover} alt={currentSong.title} className={styles.coverArt} />
                    <div className={styles.textInfo}>
                        <p className={styles.title}>{currentSong.title}</p>
                        <p className={styles.artist}>
                            {currentSong.artist} {currentSong.album ? `• ${currentSong.album}` : ""}
                        </p>
                    </div>
                </div>

                <div className={styles.playerControls}>
                    <div className={styles.controls}>
                        <FaRandom
                            className={`${styles.controlIcon} ${isShuffle ? styles.active : ""}`}
                            onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                            title="Shuffle"
                        />
                        <FaStepBackward className={styles.controlIcon} onClick={(e) => { e.stopPropagation(); playPreviousSong(); }} />
                        <div className={styles.playBtn} onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </div>
                        <FaStepForward className={styles.controlIcon} onClick={(e) => { e.stopPropagation(); playNextSong(); }} />
                        <MdQueueMusic
                            className={`${styles.controlIcon} ${showQueue ? styles.active : ""}`}
                            onClick={(e) => { e.stopPropagation(); setShowQueue(!showQueue); }}
                            title="Queue"
                        />
                    </div>
                    <div className={styles.progressContainer} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.timeText}>{formatTime(currentTime)}</span>
                        <div
                            className={styles.progressBar}
                            onClick={handleProgressBarClick}
                        >
                            <div
                                className={styles.progressFill}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className={styles.timeText}>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    {/* Volume and other controls can go here */}
                </div>
            </div>
        </>
    );
}

export default MusicPlayer;
