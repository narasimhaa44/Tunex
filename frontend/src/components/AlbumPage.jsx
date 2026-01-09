import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaPlay, FaPause, FaPlus, FaTimes, FaStepForward, FaStepBackward, FaRandom, FaHeart, FaDownload, FaEllipsisH, FaTrash } from 'react-icons/fa';
import SwipeableSongItem from './SwipeableSongItem';
import styles from './MiddlePage.module.css';

export default function AlbumPage({
    albumId,
    onBack,
    setCurrentSong,
    setIsPlaying,
    currentSong,
    isPlaying,
    playPreviousSong,
    playNextSong,
    togglePlayPause,
    progress,
    currentTime,
    duration,
    handleProgressBarClick,
    formatTime,
    isPlayerModalOpen,
    setIsPlayerModalOpen,
    playbackSongs,
    setPlaybackSongs,
    isShuffle,
    setIsShuffle,
    addToQueue, // ⭐ NEW PROP
    reorderList,
    queue // ⭐ NEW PROP
}) {
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allSongs, setAllSongs] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const [draggedIndex, setDraggedIndex] = useState(null);

    const fetchAlbum = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/albums/${albumId}`)
            .then(res => {
                setAlbum(res.data.album);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const checkLikeStatus = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/liked-albums`);
            if (res.data.success) {
                const liked = res.data.likedAlbums.some(id => id === albumId || id._id === albumId);
                setIsLiked(liked);
            }
        } catch (err) {
            console.error("Error checking like status:", err);
        }
    };

    const toggleLike = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/like-album`, { albumId });
            if (res.data.success) {
                setIsLiked(res.data.isLiked);
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    useEffect(() => {
        if (!albumId) return;
        fetchAlbum();
        checkLikeStatus();
    }, [albumId]);

    const handleSongClick = (song) => {
        // Set context to this album's songs
        if (album && album.songs) {
            const formattedSongs = album.songs.map(s => ({
                id: s._id,
                title: s.title,
                artist: s.artist,
                duration: s.duration,
                audio: s.audioUrl,
                cover: s.coverUrl
            }));
            setPlaybackSongs(formattedSongs);
        }

        const songData = {
            id: song._id,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            audio: song.audioUrl,
            cover: song.coverUrl
        };

        if (currentSong?.id === song._id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(songData);
            setIsPlaying(true);
        }
        // Always ensure the parent's horizontal modal opens
        // setIsPlayerModalOpen(true);
    };

    const handleDeleteAlbum = async () => {
        if (!window.confirm("Are you sure you want to delete this album?")) return;
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/albums/${albumId}`);
            if (res.data.ok) {
                alert("Album deleted");
                onBack(); // Go back to Home
            }
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete album");
        }
    };

    const openAddSongModal = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/songs/all`);
            if (res.data.songs) {
                setAllSongs(res.data.songs);
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error("Failed to fetch songs", err);
        }
    };

    const addSongToAlbum = async (songId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/albums/${albumId}/add-song`, { songId });
            // Refresh album data
            fetchAlbum();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to add song", err);
            alert("Failed to add song");
        }
    };

    if (loading) return <div style={{ padding: '20px', color: 'var(--text-color)' }}>Loading...</div>;
    if (!album) return <div style={{ padding: '20px', color: 'var(--text-color)' }}>Album not found</div>;

    // Filter out songs already in the album
    const availableSongs = allSongs.filter(s => !album.songs.some(as => as._id === s._id));

    return (
        <div className={styles.libraryContent}>
            <div className={styles.songListContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <button
                        onClick={openAddSongModal}
                        style={{
                            background: '#1db954',
                            color: '#000',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <FaPlus size={12} /> Add Songs
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', marginBottom: '30px' }}>
                    <img
                        src={album.coverUrl}
                        alt={album.title}
                        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                    />
                    <div>
                        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Album</h4>
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '10px 0' }}>{album.title}</h1>
                        <p style={{ opacity: 0.8 }}>{album.description}</p>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                            {album.releaseDate ? new Date(album.releaseDate).getFullYear() : ''} • {album.songs.length} songs
                        </p>

                        {/* Action Buttons Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
                            {/* <FaRandom
                                size={20}
                                style={{ color: isShuffle ? '#1db954' : 'var(--text-color)', opacity: isShuffle ? 1 : 0.7, cursor: 'pointer' }}
                                title="Shuffle"
                                onClick={() => setIsShuffle(!isShuffle)}
                            /> */}
                            {/* <div
                                onClick={toggleLike}
                                style={{
                                    backgroundColor: isLiked ? '#1ed760' : 'transparent',
                                    border: isLiked ? 'none' : '1px solid #888',
                                    borderRadius: '50%',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaHeart size={20} color={isLiked ? "black" : "var(--text-color)"} />
                            </div> */}
                            {/* <div style={{ border: '2px solid #888', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <FaDownload size={16} style={{ color: 'var(--text-color)' }} />
                            </div> */}
                            {/* Delete Option */}
                            <FaTrash
                                size={20}
                                style={{ color: 'var(--text-color)', opacity: 0.7, cursor: 'pointer' }}
                                title="Delete Album"
                                onClick={handleDeleteAlbum}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {album.songs.map((song, index) => (
                        <SwipeableSongItem
                            key={song._id}
                            onClick={() => handleSongClick(song)}
                            onQueue={() => addToQueue({ ...song, id: song._id, cover: song.coverUrl, audio: song.audioUrl })}
                            onDragStart={(e) => {
                                e.dataTransfer.setData("text/plain", index);
                                setDraggedIndex(index);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                                const toIndex = index;
                                if (reorderList && album) {
                                    const newSongs = reorderList(album.songs, fromIndex, toIndex);
                                    setAlbum({ ...album, songs: newSongs });
                                }
                                setDraggedIndex(null);
                            }}
                            onDragEnd={() => setDraggedIndex(null)}
                            className={draggedIndex === index ? styles.dragging : ""}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                backgroundColor: currentSong?.id === song._id ? 'rgba(128, 128, 128, 0.2)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                width: '100%'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentSong?.id === song._id ? 'rgba(128, 128, 128, 0.2)' : 'transparent'}
                        >
                            <span style={{ opacity: 0.6, width: '20px', textAlign: 'center' }}>
                                {currentSong?.id === song._id && isPlaying ? <FaPause size={12} color="#1db954" /> : index + 1}
                            </span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: '500', color: currentSong?.id === song._id ? '#1db954' : 'var(--text-color)' }}>{song.title}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>{song.artist}</p>
                            </div>
                            {/* ⭐ NEW: Add to Queue Icon */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToQueue({ ...song, id: song._id, cover: song.coverUrl, audio: song.audioUrl });
                                }}
                                title="Add to Queue"
                                style={{ padding: '8px', cursor: 'pointer', opacity: 0.7 }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                            >
                                <FaPlus size={14} />
                            </div>
                            <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>{song.duration}</span>
                        </SwipeableSongItem>
                    ))}
                </div>
            </div>


            {/* Add Songs Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-color)',
                        padding: '20px',
                        borderRadius: '12px',
                        width: '400px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-color)' }}>Add Songs to Album</h2>
                            <FaTimes style={{ cursor: 'pointer', color: 'var(--text-color)' }} onClick={() => setIsModalOpen(false)} />
                        </div>

                        {availableSongs.length === 0 ? (
                            <p style={{ opacity: 0.6, textAlign: 'center', color: 'var(--text-color)' }}>No new songs available to add.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {availableSongs.map(song => (
                                    <div
                                        key={song._id}
                                        onClick={() => addSongToAlbum(song._id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-color)',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--dropdown-hover-bg)'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <img src={song.coverUrl} alt={song.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-color)' }}>{song.title}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, color: 'var(--text-color)' }}>{song.artist}</p>
                                        </div>
                                        <FaPlus style={{ marginLeft: 'auto', opacity: 0.6, color: 'var(--text-color)' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
