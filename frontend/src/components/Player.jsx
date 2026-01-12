import React from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import { HiQueueList } from 'react-icons/hi2';
import styles from './Player.module.css';

export default function Player({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  isShuffle,
  setIsShuffle,
  onQueue
}) {
  // Pure UI component - Audio is handled globally

  return (
    <div className={styles.playerBar}>
      {/* Cover Art */}
      <div className={styles.coverWrapper}>
        <img
          src={song.coverUrl || song.cover}
          alt={song.title}
          className={styles.cover}
        />
      </div>

      {/* Song Info */}
      <div className={styles.songInfo}>
        <div className={styles.title}>{song.title}</div>
        <div className={styles.artist}>{song.artist}</div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${isShuffle ? styles.active : ''}`}
          onClick={() => setIsShuffle && setIsShuffle(!isShuffle)}
          title="Shuffle"
        >
          <FaRandom style={{ color: isShuffle ? '#1db954' : 'inherit' }} />
        </button>

        <button className={styles.controlBtn} onClick={onPrev}>
          <FaStepBackward />
        </button>

        <button className={styles.playPauseBtn} onClick={onPlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: '2px' }} />}
        </button>

        <button className={styles.controlBtn} onClick={onNext}>
          <FaStepForward />
        </button>

        <button className={`${styles.controlBtn} ${styles.queueBtn}`} onClick={onQueue}>
          <HiQueueList />
        </button>
      </div>
    </div>
  );
}
