import SwipeableSongItem from "./SwipeableSongItem";
import styles from "./MiddlePage.module.css";
import { GoHomeFill } from "react-icons/go";
import { FaFire, FaCompass, FaCog, FaBars, FaPlay, FaPause, FaStepForward, FaStepBackward, FaCloudUploadAlt, FaHeart, FaPlus, FaEllipsisV, FaRandom } from "react-icons/fa";
import { MdLibraryMusic, MdEvent, MdAlbum, MdPlaylistPlay, MdQueueMusic } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadPage from "./UploadPage";
import AlbumPage from "./AlbumPage";
import HomeDashboard from "./HomeDashboard";
import MoodAnalyser from "./MoodAnalyser"; // Placeholder
import ArtistProfile from "./ArtistProfile"; // New component
import Player from "./Player"; // New Floating component
import { cacheSongAssets } from "../utils/offlineUtils";

const MiddlePage = ({
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    allSongs,
    setAllSongs,
    playbackSongs,
    setPlaybackSongs,
    albums,
    active,
    setActive,
    isShuffle,
    setIsShuffle,
    queue,
    setQueue,
    playNextSong,
    playPreviousSong,
    progress,
    currentTime,
    duration,
    audioRef,
    searchQuery,
    isOnline,
    showQueue,
    setShowQueue
}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [selectedArtistForProfile, setSelectedArtistForProfile] = useState(null); // New state
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [volume, setVolume] = useState(1); // Default max volume
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            setActive("Discover");
        }
    }, [searchQuery, setActive]);

    useEffect(() => {
        const fetchUserData = async () => {
            const savedLiked = localStorage.getItem("tunex_liked_songs");
            if (savedLiked) {
                try {
                    setLikedSongs(JSON.parse(savedLiked));
                } catch (e) {
                    console.error("Error parsing saved liked songs", e);
                }
            }

            if (!isOnline) return;

            try {
                const [likedRes, playlistRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/liked-songs`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/playlists/my-playlists`)
                ]);

                if (likedRes.data.success) {
                    const formattedLiked = likedRes.data.likedSongs.map(s => ({
                        ...s,
                        id: s._id,
                        cover: s.coverUrl,
                        audio: s.audioUrl
                    }));
                    setLikedSongs(formattedLiked);
                    localStorage.setItem("tunex_liked_songs", JSON.stringify(formattedLiked));

                    // Trigger caching for all liked songs
                    formattedLiked.forEach(s => cacheSongAssets(s));
                }

                if (playlistRes.data.success) {
                    setPlaylists(playlistRes.data.playlists);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [isOnline]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { name: "Home", icon: <GoHomeFill className={styles.icon} /> },
        { name: "Discover", icon: <FaCompass className={styles.icon} /> },
        { name: "Liked Songs", icon: <FaHeart className={styles.icon} /> },
        { name: "Upload", icon: <FaCloudUploadAlt className={styles.icon} /> },
        { name: "Create Album", icon: <MdAlbum className={styles.icon} /> },
    ];

    const generalItems = [
        { name: "Settings", icon: <FaCog className={styles.icon} /> },
        { name: "Log Out", icon: <MdEvent className={styles.icon} /> },
    ];

    const reorderList = (list, fromIndex, toIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        return result;
    };

    const handleSongsReorder = (from, to) => {
        setAllSongs(reorderList(allSongs, from, to));
    };

    const handleLikedReorder = (from, to) => {
        setLikedSongs(reorderList(likedSongs, from, to));
    };

    const handleMenuClick = (page) => {
        if (page === "Create Album") {
            navigate('/create-album');
            return;
        }
        setActive(page);
        setSelectedAlbumId(null);
        setSelectedPlaylist(null);
    };

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
        setActive("PlaylistView");
    };

    const createPlaylist = async () => {
        if (!newPlaylistName.trim()) {
            alert("Please enter a playlist name");
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/playlists/create`, { title: newPlaylistName });
            if (res.data.success) {
                setPlaylists([...playlists, res.data.playlist]);
                setNewPlaylistName("");
                setShowPlaylistModal(false);
                showNotification("Playlist created successfully!");
            }
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist");
        }
    };

    const handleAlbumClick = (albumId) => {
        setSelectedAlbumId(albumId);
        setActive("AlbumView");
    };

    const handleSongClick = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        // Removed: setIsPlayerModalOpen(true); // Don't open modal automatically, just start playing with mini bar
    };

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    const handleProgressBarClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audioRef.current.currentTime = percentage * audioRef.current.duration;
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const addToLiked = async (song) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/like-song`, { songId: song.id });
            if (res.data.success) {
                if (res.data.isLiked) {
                    const likedSong = { ...song, cover: song.cover || song.coverUrl, audio: song.audio || song.audioUrl };
                    setLikedSongs(prev => [...prev, likedSong]);
                    showNotification(`Added "${song.title}" to Liked Songs`);

                    // Trigger caching for offline access
                    cacheSongAssets(likedSong);
                } else {
                    setLikedSongs(prev => prev.filter(s => s.id !== song.id));
                    showNotification(`Removed "${song.title}" from Liked Songs`);
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const addToPlaylist = async (playlistId, songId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/playlists/add-song`, { playlistId, songId });
            if (res.data.success) {
                showNotification("Added to playlist!");
                // Update local state if needed
            }
        } catch (error) {
            console.error("Error adding to playlist:", error);
            showNotification(error.response?.data?.message || "Error adding to playlist");
        }
    };

    const removeFromPlaylist = async (songId) => {
        if (!selectedPlaylist) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/playlists/remove-song`, { playlistId: selectedPlaylist._id, songId });
            if (res.data.success) {
                const newSongs = selectedPlaylist.songs.filter(s => (s.id || s._id) !== songId);
                const updatedPlaylist = { ...selectedPlaylist, songs: newSongs };
                setSelectedPlaylist(updatedPlaylist);
                setPlaylists(prev => prev.map(p => p._id === selectedPlaylist._id ? updatedPlaylist : p));
                showNotification("Removed from playlist");
            }
        } catch (error) {
            console.error("Error removing from playlist:", error);
            showNotification("Error removing song");
        }
    };

    const addToQueue = (song) => {
        const formattedSong = {
            ...song,
            id: song.id || song._id,
            cover: song.cover || song.coverUrl,
            audio: song.audio || song.audioUrl
        };
        setQueue(prev => [...prev, formattedSong]);
        showNotification(`Added "${song.title}" to Queue`);
    };

    const queueAlbum = async (albumId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/albums/${albumId}`);
            if (res.data.success && res.data.album.songs) {
                const songsToQueue = res.data.album.songs.map(s => ({
                    ...s,
                    id: s._id,
                    cover: s.coverUrl,
                    audio: s.audioUrl
                }));
                setQueue(prev => [...prev, ...songsToQueue]);
                showNotification(`Added "${res.data.album.title}" to queue`);
            }
        } catch (error) {
            console.error("Error queueing album:", error);
            showNotification("Failed to queue album");
        }
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className={styles.outer} style={{ height: active !== "Home" ? "calc(100vh - 80px)" : "calc(100vh - 165px)" }}>
            {/* Sidebar */}
            {/* OFFLINE SPLASH OVERLAY */}
            {!isOnline && (active === "Home" || active === "Discover" || active === "Trends") && (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    textAlign: 'center',
                    background: 'linear-gradient(to bottom, #1a1a1a, #121212)',
                    color: 'white',
                    height: '100%',
                    zIndex: 10
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>📶</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Network Lost</h1>
                    <p style={{ fontSize: '1.1rem', color: '#b3b3b3', maxWidth: '400px', lineHeight: '1.6', marginBottom: '32px' }}>
                        You're currently offline. But don't worry, your music doesn't have to stop!
                    </p>
                    <button
                        onClick={() => setActive("Liked Songs")}
                        style={{
                            backgroundColor: '#1db954',
                            color: 'black',
                            border: 'none',
                            padding: '14px 32px',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)'
                        }}
                    >
                        Listen to Liked Songs
                    </button>
                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#666' }}>
                        Liked songs are available offline.
                    </p>
                </div>
            )}

            <div className={`${styles.left} ${isCollapsed ? styles.collapsed : ""}`}>
                <div className={styles.toggleBtn} onClick={toggleSidebar}>
                    <FaBars className={styles.icon} />
                </div>

                <div className={styles.menuSection}>
                    {!isCollapsed && <p className={styles.menuTitle}>Menu</p>}
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className={`${styles.item} ${active === item.name ? styles.active : ""}`}
                            onClick={() => handleMenuClick(item.name)}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.name}</span>}
                        </div>
                    ))}
                </div>

                <div className={styles.menuSection}>
                    {!isCollapsed && (
                        <div className={styles.playlistHeader}>
                            <p className={styles.menuTitle}>Playlists</p>
                            <FaPlus className={styles.addIcon} onClick={() => setShowPlaylistModal(true)} title="Create Playlist" />
                        </div>
                    )}
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className={`${styles.item} ${selectedPlaylist?._id === playlist._id ? styles.active : ""}`}
                            onClick={() => handlePlaylistClick(playlist)}
                        >
                            <MdPlaylistPlay className={styles.icon} />
                            {!isCollapsed && <span>{playlist.title}</span>}
                        </div>
                    ))}
                </div>

                <div className={styles.menuSection}>
                    {!isCollapsed && <p className={styles.menuTitle}>General</p>}
                    {generalItems.map((item) => (
                        <div key={item.name} className={styles.item} onClick={() => handleMenuClick(item.name)}>
                            {item.icon}
                            {!isCollapsed && <span>{item.name}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side content */}
            <div className={styles.right}>
                <div className={`${styles.contentWrapper} ${currentSong ? styles.withMiniPlayer : ""}`}>
                    <div className={styles.mainContent}>
                        {showPlaylistModal && (
                            <div className={styles.modalOverlay} onClick={() => setShowPlaylistModal(false)}>
                                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                    <h3 className={styles.modalTitle}>Create New Playlist</h3>
                                    <input
                                        type="text"
                                        className={styles.inputField}
                                        placeholder="Playlist Name"
                                        value={newPlaylistName}
                                        onChange={(e) => setNewPlaylistName(e.target.value)}
                                        autoFocus
                                    />
                                    <div className={styles.modalActions}>
                                        <button onClick={() => setShowPlaylistModal(false)}>Cancel</button>
                                        <button onClick={createPlaylist}>Create</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {notification && (
                            <div className={styles.notificationToast}>{notification}</div>
                        )}

                        {showQueue && (
                            <div
                                className={styles.queueOverlay}
                                onClick={() => setShowQueue(false)}
                            >
                                <div className={styles.queueSidebar} onClick={(e) => e.stopPropagation()}>
                                    <div className={styles.queueHeader}>
                                        <h2>Queue</h2>
                                        <span onClick={() => setShowQueue(false)}>Close</span>
                                    </div>

                                    <h3>Now playing</h3>
                                    {currentSong && (
                                        <div className={styles.queueItemActive}>
                                            <img src={currentSong.cover} alt={currentSong.title} />
                                            <div>
                                                <p className={styles.queueTitle}>{currentSong.title}</p>
                                                <p className={styles.queueArtist}>{currentSong.artist}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.queueSection}>
                                        <div className={styles.queueSectionHeader}>
                                            <h3>Next in Queue</h3>
                                            {queue.length > 0 && <span onClick={() => setQueue([])}>Clear</span>}
                                        </div>
                                        {queue.length === 0 ? <p className={styles.emptyText}>Empty</p> : (
                                            <div className={styles.queueList}>
                                                {queue.map((song, idx) => (
                                                    <div key={idx} className={styles.queueItem}>
                                                        <span>{idx + 1}</span>
                                                        <img src={song.cover} alt={song.title} />
                                                        <div className={styles.queueInfo}>
                                                            <p className={styles.queueTitle}>{song.title}</p>
                                                            <p className={styles.queueArtist}>{song.artist}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.queueSection}>
                                        <h3>Next from: {active}</h3>
                                        <div className={styles.queueList}>
                                            {playbackSongs
                                                .slice(playbackSongs.findIndex(s => s.id === currentSong?.id) + 1)
                                                .map((song, idx) => (
                                                    <div key={`s-${idx}`} className={styles.queueItem} style={{ opacity: 0.8 }}>
                                                        <img src={song.cover} alt={song.title} />
                                                        <div className={styles.queueInfo}>
                                                            <p className={styles.queueTitle}>{song.title}</p>
                                                            <p className={styles.queueArtist}>{song.artist}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {active === "Upload" && <UploadPage songs={allSongs} setSongs={setAllSongs} />}

                        {active === "AlbumView" && selectedAlbumId && (
                            <AlbumPage
                                albumId={selectedAlbumId}
                                onBack={() => setActive("Home")}
                                setCurrentSong={setCurrentSong}
                                setIsPlaying={setIsPlaying}
                                currentSong={currentSong}
                                isPlaying={isPlaying}
                                playbackSongs={playbackSongs}
                                setPlaybackSongs={setPlaybackSongs}
                                playPreviousSong={playPreviousSong}
                                playNextSong={playNextSong}
                                togglePlayPause={togglePlayPause}
                                progress={progress}
                                currentTime={currentTime}
                                duration={duration}
                                handleProgressBarClick={handleProgressBarClick}
                                formatTime={formatTime}
                                isPlayerModalOpen={isPlayerModalOpen}
                                setIsPlayerModalOpen={setIsPlayerModalOpen}
                                isShuffle={isShuffle}
                                setIsShuffle={setIsShuffle}
                                addToQueue={addToQueue}
                                reorderList={reorderList}
                                queue={queue}
                                showQueue={showQueue}
                                setShowQueue={setShowQueue}
                            />
                        )}

                        {active === "PlaylistView" && selectedPlaylist && (
                            <SongListSection
                                title={selectedPlaylist.title}
                                songs={selectedPlaylist.songs.map(s => ({ ...s, id: s._id, cover: s.coverUrl, audio: s.audioUrl }))}
                                currentSong={currentSong}
                                handleSongClick={(song) => {
                                    const formatted = selectedPlaylist.songs.map(s => ({ ...s, id: s._id, cover: s.coverUrl, audio: s.audioUrl }));
                                    setPlaybackSongs(formatted);
                                    handleSongClick(song);
                                }}
                                draggedIndex={draggedIndex}
                                setDraggedIndex={setDraggedIndex}
                                likedSongs={likedSongs}
                                addToLiked={addToLiked}
                                playlists={playlists}
                                addToPlaylist={addToPlaylist}
                                setShowPlaylistModal={setShowPlaylistModal}
                                addToQueue={addToQueue}
                                removeFromPlaylist={removeFromPlaylist}
                                onSongsReorder={(from, to) => {
                                    const newSongs = reorderList(selectedPlaylist.songs, from, to);
                                    setSelectedPlaylist({ ...selectedPlaylist, songs: newSongs });
                                    setPlaylists(playlists.map(p => p._id === selectedPlaylist._id ? { ...p, songs: newSongs } : p));
                                }}
                            />
                        )}

                        {active === "Liked Songs" && (
                            <SongListSection
                                title="Liked Songs"
                                songs={likedSongs}
                                currentSong={currentSong}
                                handleSongClick={(song) => {
                                    setPlaybackSongs(likedSongs);
                                    handleSongClick(song);
                                }}
                                draggedIndex={draggedIndex}
                                setDraggedIndex={setDraggedIndex}
                                likedSongs={likedSongs}
                                addToLiked={addToLiked}
                                playlists={playlists}
                                addToPlaylist={addToPlaylist}
                                setShowPlaylistModal={setShowPlaylistModal}
                                addToQueue={addToQueue}
                                onSongsReorder={handleLikedReorder}
                            />
                        )}


                        {active === "Home" && (
                            <HomeDashboard
                                albums={albums}
                                onAlbumClick={handleAlbumClick}
                                setActive={setActive}
                                onPlayArtist={(artist) => {
                                    setSelectedArtistForProfile(artist);
                                    setActive("ArtistProfile");
                                }}
                            />
                        )}

                        {active === "ArtistProfile" && selectedArtistForProfile && (
                            <ArtistProfile
                                artist={selectedArtistForProfile}
                                songs={allSongs}
                                albums={albums} // Pass albums
                                onAlbumClick={handleAlbumClick} // Pass click handler
                                onQueue={(song) => setQueue(prev => [...prev, song])} // Pass queue handler
                                currentSong={currentSong}
                                onSongClick={(song) => {
                                    setPlaybackSongs(allSongs.filter(s =>
                                        s.artist.toLowerCase().includes(selectedArtistForProfile.name.toLowerCase()) ||
                                        (s.artists && s.artists.includes(selectedArtistForProfile.name))
                                    ));
                                    handleSongClick(song);
                                }}
                                onBack={() => setActive("Home")}
                            />
                        )}

                        {active === "Mood Analyser" && <MoodAnalyser />}

                        {active === "Discover" && (
                            <SongListSection
                                title={searchQuery ? `Results for "${searchQuery}"` : "Discover"}
                                songs={searchQuery ? allSongs.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())) : allSongs}
                                currentSong={currentSong}
                                handleSongClick={(song) => {
                                    setPlaybackSongs(allSongs);
                                    handleSongClick(song);
                                }}
                                draggedIndex={draggedIndex}
                                setDraggedIndex={setDraggedIndex}
                                likedSongs={likedSongs}
                                addToLiked={addToLiked}
                                playlists={playlists}
                                addToPlaylist={addToPlaylist}
                                setShowPlaylistModal={setShowPlaylistModal}
                                addToQueue={addToQueue}
                                onSongsReorder={handleSongsReorder}
                            />
                        )}
                    </div> {/* end mainContent */}

                    {/* Side Now Playing Card (Placed as Sibling to mainContent) */}
                    {currentSong && (active === "Discover" || active === "AlbumView" || active === "PlaylistView" || active === "Liked Songs" || active === "Home") && (
                        <div className={styles.sidePlayer}>
                            <div className={styles.sidePlayerCard} onClick={() => setIsPlayerModalOpen(true)}>
                                <div className={styles.glassTopRow}>
                                    <img src={currentSong.cover} alt={currentSong.title} className={styles.glassCover} />
                                    <div className={styles.glassInfo}>
                                        <h2>{currentSong.title}</h2>
                                        <p className={styles.glassArtist}>{currentSong.artist}</p>
                                    </div>
                                </div>
                                <div className={styles.sideCardBody}>
                                    <div className={styles.sideControls}>
                                        <FaRandom
                                            className={`${styles.sideIcon} ${isShuffle ? styles.activeIcon : ""}`}
                                            onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                                        />
                                        <FaStepBackward className={styles.sideIcon} onClick={(e) => { e.stopPropagation(); playPreviousSong(); }} />
                                        <div className={styles.sidePlayBtn} onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>
                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                        </div>
                                        <FaStepForward className={styles.sideIcon} onClick={(e) => { e.stopPropagation(); playNextSong(); }} />
                                        <MdQueueMusic
                                            className={`${styles.sideIcon} ${showQueue ? styles.activeIcon : ""}`}
                                            onClick={(e) => { e.stopPropagation(); setShowQueue(!showQueue); }}
                                        />
                                    </div>

                                    {/* Side Player Progress Bar */}
                                    <div className={styles.sideProgressContainer} onClick={(e) => e.stopPropagation()}>
                                        <div className={styles.sideProgressBar} onClick={handleProgressBarClick}>
                                            <div
                                                className={styles.sideProgressFill}
                                                style={{ width: `${(currentTime / duration) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className={styles.sideTimeRow}>
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Global Floating Player (Restricted to Artist Profile) */}
                    {currentSong && (active === "ArtistProfile" || active === "AlbumView" || active === "PlaylistView" || active === "Liked Songs" || active === "Discover") && (
                        <Player
                            song={{
                                ...currentSong,
                                audioUrl: currentSong.audio || currentSong.audioUrl, // Handle data variations
                                coverUrl: currentSong.cover || currentSong.coverUrl
                            }}
                            isPlaying={isPlaying}
                            onPlayPause={togglePlayPause}
                            onNext={playNextSong}
                            onPrev={playPreviousSong}
                            onSeek={handleProgressBarClick} // Note: Player expects time, but here we might need to adjust. 
                            // Actually, Player.jsx uses onSeek(time). handleProgressBarClick in MiddlePage might be expecting an event.
                            // Let's check handleProgressBarClick implementation later if needed. 
                            // For now, let's pass the raw values.
                            currentTime={currentTime}
                            duration={duration}
                            isShuffle={isShuffle}
                            setIsShuffle={setIsShuffle}
                            onQueue={() => setShowQueue(!showQueue)}
                            volume={volume}
                            onVolumeChange={setVolume}
                        />
                    )}
                </div>
            </div>

            {currentSong && isPlayerModalOpen && (
                <div className={styles.glassModal} onClick={() => setIsPlayerModalOpen(false)}>
                    <div className={styles.glassContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.head}>
                            <div className={styles.glassCover1}>
                                <img src={currentSong.cover} alt={currentSong.title} className={styles.glassCover} />
                            </div>
                            <div className={styles.glassInfo}>
                                <h2>{currentSong.title}</h2>
                                <p className={styles.glassArtist}>{currentSong.artist}</p>
                            </div>
                        </div>
                        <div className={styles.glassBody}>
                            <div className={styles.glassControls}>
                                <FaRandom
                                    className={`${styles.glassIcon} ${isShuffle ? styles.activeIcon : ""}`}
                                    onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                                />
                                <FaStepBackward className={styles.glassIcon} onClick={(e) => { e.stopPropagation(); playPreviousSong(); }} />
                                <div className={styles.glassPlayBtn} onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </div>
                                <FaStepForward className={styles.glassIcon} onClick={(e) => { e.stopPropagation(); playNextSong(); }} />
                                <MdQueueMusic
                                    className={`${styles.glassIcon} ${showQueue ? styles.activeIcon : ""}`}
                                    onClick={(e) => { e.stopPropagation(); setShowQueue(!showQueue); }}
                                />
                            </div>

                            <div className={styles.glassProgressRow}>
                                <span className={styles.glassTime}>{formatTime(currentTime)}</span>
                                <div className={styles.glassProgressBar} onClick={handleProgressBarClick}>
                                    <div
                                        className={styles.glassProgressFill}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <span className={styles.glassTime}>{formatTime(duration)}</span>
                            </div>

                            {queue.length > 0 && (
                                <div className={styles.glassQueue}>
                                    <p className={styles.upNextLabel}>Up Next</p>
                                    <div className={styles.nextSongMini}>
                                        <img src={queue[0].cover} alt={queue[0].title} />
                                        <div className={styles.nextSongText}>
                                            <p>{queue[0].title}</p>
                                            <span>{queue[0].artist}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SongListSection = ({
    title,
    songs,
    currentSong,
    handleSongClick,
    draggedIndex,
    setDraggedIndex,
    likedSongs,
    addToLiked,
    playlists,
    addToPlaylist,
    setShowPlaylistModal,
    addToQueue,
    removeFromPlaylist,
    onSongsReorder
}) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [subMenuOpenId, setSubMenuOpenId] = useState(null);
    const subMenuTimer = useRef(null);

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
        setSubMenuOpenId(null);
    };

    const handleSubMenuEnter = (id) => {
        if (subMenuTimer.current) clearTimeout(subMenuTimer.current);
        setSubMenuOpenId(id);
    };

    const handleSubMenuLeave = () => {
        subMenuTimer.current = setTimeout(() => {
            setSubMenuOpenId(null);
        }, 300);
    };

    const toggleSubMenuClick = (e, id) => {
        e.stopPropagation();
        if (subMenuOpenId === id) {
            setSubMenuOpenId(null);
        } else {
            setSubMenuOpenId(id);
        }
    };

    return (
        <div className={styles.libraryContent}>
            <div className={styles.songListContainer}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <div className={styles.songList}>
                    {songs && songs.map((song, index) => (
                        <SwipeableSongItem
                            key={song.id}
                            className={`${styles.songItem} ${currentSong?.id === song.id ? styles.playing : ""} ${draggedIndex === index ? styles.dragging : ""}`}
                            style={{ zIndex: openMenuId === song.id ? 100 : 1 }}
                            onClick={() => handleSongClick(song)}
                            onQueue={() => addToQueue(song)}
                            onDragStart={(e) => {
                                e.dataTransfer.setData("text/plain", index);
                                setDraggedIndex(index);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const from = parseInt(e.dataTransfer.getData("text/plain"));
                                if (onSongsReorder) onSongsReorder(from, index);
                                setDraggedIndex(null);
                            }}
                            onDragEnd={() => setDraggedIndex(null)}
                        >
                            <img src={song.cover} alt={song.title} className={styles.songCover} />
                            <div className={styles.songInfo}>
                                <p className={styles.songTitle}>{song.title}</p>
                                <p className={styles.songArtist}>{song.artist}</p>
                            </div>
                            <span className={styles.songDuration}>{song.duration}</span>

                            <div className={styles.songOptions}>
                                {likedSongs?.some(s => s.id === song.id) && <FaHeart className={styles.likedIcon} />}
                                <div className={styles.menuContainer}>
                                    <FaEllipsisV className={styles.menuIcon} onClick={(e) => toggleMenu(e, song.id)} />
                                    {openMenuId === song.id && (
                                        <div className={styles.dropdownMenu} onMouseLeave={() => setOpenMenuId(null)}>
                                            <div className={styles.menuItem} onClick={(e) => { e.stopPropagation(); addToQueue(song); setOpenMenuId(null); }}>
                                                <MdQueueMusic /> Add to queue
                                            </div>
                                            <div
                                                className={styles.menuItem}
                                                onMouseEnter={() => handleSubMenuEnter(song.id)}
                                                onMouseLeave={handleSubMenuLeave}
                                                onClick={(e) => toggleSubMenuClick(e, song.id)}
                                            >
                                                <span>Add to playlist</span>
                                                {subMenuOpenId === song.id && (
                                                    <div className={styles.subMenu} onMouseEnter={() => handleSubMenuEnter(song.id)}>
                                                        <div className={styles.subMenuItem} onClick={(e) => { e.stopPropagation(); setShowPlaylistModal(true); setOpenMenuId(null); }}>
                                                            <FaPlus /> New playlist
                                                        </div>
                                                        {playlists?.map(pl => (
                                                            <div key={pl._id} className={styles.subMenuItem} onClick={(e) => { e.stopPropagation(); addToPlaylist(pl._id, song.id); setOpenMenuId(null); }}>
                                                                {pl.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.menuItem} onClick={(e) => { e.stopPropagation(); addToLiked(song); setOpenMenuId(null); }}>
                                                {likedSongs?.some(s => s.id === song.id) ? "Remove from Liked" : "Add to Liked"}
                                            </div>
                                            {removeFromPlaylist && (
                                                <div className={styles.menuItem} onClick={(e) => { e.stopPropagation(); removeFromPlaylist(song.id); setOpenMenuId(null); }}>
                                                    <span style={{ color: '#ff5555' }}>Remove from this playlist</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwipeableSongItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CenterText = ({ title, desc }) => (
    <div className={styles.centeredContent}>
        <h2>{title}</h2>
        <p>{desc}</p>
    </div>
);

export default MiddlePage;
