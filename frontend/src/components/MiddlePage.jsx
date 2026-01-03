// import styles from "./MiddlePage.module.css";
// import { GoHomeFill } from "react-icons/go";
// import { FaFire, FaCompass, FaCog, FaBars, FaPlay, FaPause, FaStepForward, FaStepBackward, FaCloudUploadAlt } from "react-icons/fa";
// import { MdLibraryMusic, MdEvent } from "react-icons/md";
// import { useState } from "react";
// import UploadPage from "./UploadPage";

// const MiddlePage = ({ currentSong, setCurrentSong, isPlaying, setIsPlaying, songs, setSongs, setActivePage, activePage, progress, currentTime, duration, audioRef }) => {
//     const [active, setActive] = useState("Library");
//     const [isCollapsed, setIsCollapsed] = useState(true);
//     const [draggedIndex, setDraggedIndex] = useState(null);
//     const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

//     const toggleSidebar = () => {
//         setIsCollapsed(!isCollapsed);
//     };

//     const menuItems = [
//         { name: "Home", icon: <GoHomeFill className={styles.icon} /> },
//         { name: "Trends", icon: <FaFire className={styles.icon} /> },
//         { name: "Library", icon: <MdLibraryMusic className={styles.icon} /> },
//         { name: "Discover", icon: <FaCompass className={styles.icon} /> },
//         { name: "Upload", icon: <FaCloudUploadAlt className={styles.icon} /> },
//     ];

//     const generalItems = [
//         { name: "Settings", icon: <FaCog className={styles.icon} /> },
//         { name: "Log Out", icon: <MdEvent className={styles.icon} /> },
//     ];

//     const handleMenuClick = (pageName) => {
//         console.log('Page switch:', pageName, 'isPlaying:', isPlaying);
//         setActive(pageName);
//         setActivePage(pageName);
//     };

//     const handleSongClick = (song) => {
//         setCurrentSong(song);
//         setIsPlaying(true);
//     };

//     const togglePlayPause = () => {
//         setIsPlaying(!isPlaying);
//     };

//     const playNextSong = () => {
//         const currentIndex = songs.findIndex(song => song.id === currentSong.id);
//         const nextIndex = (currentIndex + 1) % songs.length;
//         setCurrentSong(songs[nextIndex]);
//         setIsPlaying(true);
//     };

//     const playPreviousSong = () => {
//         const currentIndex = songs.findIndex(song => song.id === currentSong.id);
//         const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
//         setCurrentSong(songs[prevIndex]);
//         setIsPlaying(true);
//     };

//     const handleProgressBarClick = (e) => {
//         const progressBar = e.currentTarget;
//         const audio = audioRef.current;
//         if (!progressBar || !audio) return;

//         const rect = progressBar.getBoundingClientRect();
//         const clickX = e.clientX - rect.left;
//         const width = rect.width;
//         const percentage = clickX / width;
//         const newTime = percentage * audio.duration;

//         audio.currentTime = newTime;
//     };

//     const formatTime = (time) => {
//         if (isNaN(time)) return "0:00";
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const handleDragStart = (e, index) => {
//         setDraggedIndex(index);
//         e.dataTransfer.effectAllowed = 'move';
//     };

//     const handleDragOver = (e, index) => {
//         e.preventDefault();
//         if (draggedIndex === null || draggedIndex === index) return;

//         const newSongs = [...songs];
//         const draggedSong = newSongs[draggedIndex];
//         newSongs.splice(draggedIndex, 1);
//         newSongs.splice(index, 0, draggedSong);

//         setSongs(newSongs);
//         setDraggedIndex(index);
//     };

//     const handleDragEnd = () => {
//         setDraggedIndex(null);
//     };

//     return (
//         <div className={styles.outer}>
//             <div className={`${styles.left} ${isCollapsed ? styles.collapsed : ''}`}>
//                 <div className={styles.toggleBtn} onClick={toggleSidebar}>
//                     <FaBars className={styles.icon} />
//                 </div>

//                 <div className={styles.menuSection}>
//                     {!isCollapsed && <p className={styles.menuTitle}>Menu</p>}
//                     {menuItems.map((item) => (
//                         <div
//                             key={item.name}
//                             className={`${styles.item} ${active === item.name ? styles.active : ''}`}
//                             onClick={() => handleMenuClick(item.name)}
//                             title={isCollapsed ? item.name : ""}
//                         >
//                             {item.icon}
//                             {!isCollapsed && <span>{item.name}</span>}
//                         </div>
//                     ))}
//                 </div>

//                 <div className={styles.menuSection}>
//                     {!isCollapsed && <p className={styles.menuTitle}>General</p>}
//                     {generalItems.map((item) => (
//                         <div
//                             key={item.name}
//                             className={`${styles.item} ${active === item.name ? styles.active : ''}`}
//                             onClick={() => handleMenuClick(item.name)}
//                             title={isCollapsed ? item.name : ""}
//                         >
//                             {item.icon}
//                             {!isCollapsed && <span>{item.name}</span>}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className={styles.right}>
//                 {active === 'Upload' ? (
//                     <UploadPage setSongs={setSongs} songs={songs} />
//                 ) : active === 'Library' ? (
//                     <div className={styles.libraryContent}>
//                         <div className={styles.songListContainer}>
//                             <h2 className={styles.sectionTitle}>Liked Songs</h2>
//                             <div className={styles.songList}>
//                                 {songs.map((song, index) => (
//                                     <div
//                                         key={song.id}
//                                         className={`${styles.songItem} ${currentSong?.id === song.id ? styles.playing : ''} ${draggedIndex === index ? styles.dragging : ''}`}
//                                         onClick={() => handleSongClick(song)}
//                                         draggable
//                                         onDragStart={(e) => handleDragStart(e, index)}
//                                         onDragOver={(e) => handleDragOver(e, index)}
//                                         onDragEnd={handleDragEnd}
//                                     >
//                                         <img src={song.cover} alt={song.title} className={styles.songCover} />
//                                         <div className={styles.songInfo}>
//                                             <p className={styles.songTitle}>{song.title}</p>
//                                             <p className={styles.songArtist}>{song.artist}</p>
//                                         </div>
//                                         <span className={styles.songDuration}>{song.duration}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {currentSong && (
//                             <>
//                                 {/* Mobile Modal Player */}
//                                 {isPlayerModalOpen && (
//                                     <div className={styles.playerModal} onClick={() => setIsPlayerModalOpen(false)}>
//                                         <div className={styles.playerModalContent} onClick={(e) => e.stopPropagation()}>
//                                             <img src={currentSong.cover} alt={currentSong.title} className={styles.modalCover} />
//                                             <div className={styles.modalInfo}>
//                                                 <h2 className={styles.modalTitle}>{currentSong.title}</h2>
//                                                 <p className={styles.modalArtist}>{currentSong.artist}</p>
//                                             </div>
//                                             <div className={styles.modalControls}>
//                                                 <FaStepBackward className={styles.modalControlIcon} onClick={playPreviousSong} />
//                                                 <div className={styles.modalPlayBtn} onClick={togglePlayPause}>
//                                                     {isPlaying ? <FaPause /> : <FaPlay />}
//                                                 </div>
//                                                 <FaStepForward className={styles.modalControlIcon} onClick={playNextSong} />
//                                             </div>
//                                             <div className={styles.modalProgressContainer}>
//                                                 <span className={styles.timeText}>{formatTime(currentTime)}</span>
//                                                 <div
//                                                     className={styles.progressBar}
//                                                     onClick={handleProgressBarClick}
//                                                 >
//                                                     <div
//                                                         className={styles.progressFill}
//                                                         style={{ width: `${progress}%` }}
//                                                     ></div>
//                                                 </div>
//                                                 <span className={styles.timeText}>{formatTime(duration)}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Player Card */}
//                                 <div className={styles.playerContainer} onClick={() => setIsPlayerModalOpen(true)}>
//                                     <div className={styles.playerCard}>
//                                         <img src={currentSong.cover} alt={currentSong.title} className={styles.largeCover} />
//                                         <div className={styles.playerInfo}>
//                                             <h3>{currentSong.title}</h3>
//                                             <p>{currentSong.artist}</p>
//                                         </div>
//                                         <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
//                                             <FaStepBackward className={styles.controlIcon} onClick={playPreviousSong} />
//                                             <div className={styles.playBtn} onClick={togglePlayPause}>
//                                                 {isPlaying ? <FaPause /> : <FaPlay />}
//                                             </div>
//                                             <FaStepForward className={styles.controlIcon} onClick={playNextSong} />
//                                         </div>
//                                         <div className={styles.progressContainer} onClick={(e) => e.stopPropagation()}>
//                                             <span className={styles.timeText}>{formatTime(currentTime)}</span>
//                                             <div
//                                                 className={styles.progressBar}
//                                                 onClick={handleProgressBarClick}
//                                             >
//                                                 <div
//                                                     className={styles.progressFill}
//                                                     style={{ width: `${progress}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className={styles.timeText}>{formatTime(duration)}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 ) : active === 'Home' ? (
//                     <div className={styles.libraryContent}>
//                         <div className={styles.songListContainer}>
//                             <h2 className={styles.sectionTitle}>All Songs</h2>
//                             <div className={styles.songList}>
//                                 {songs.map((song, index) => (
//                                     <div
//                                         key={song.id}
//                                         className={`${styles.songItem} ${currentSong?.id === song.id ? styles.playing : ''} ${draggedIndex === index ? styles.dragging : ''}`}
//                                         onClick={() => handleSongClick(song)}
//                                         draggable
//                                         onDragStart={(e) => handleDragStart(e, index)}
//                                         onDragOver={(e) => handleDragOver(e, index)}
//                                         onDragEnd={handleDragEnd}
//                                     >
//                                         <img src={song.cover} alt={song.title} className={styles.songCover} />
//                                         <div className={styles.songInfo}>
//                                             <p className={styles.songTitle}>{song.title}</p>
//                                             <p className={styles.songArtist}>{song.artist}</p>
//                                         </div>
//                                         <span className={styles.songDuration}>{song.duration}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {currentSong && (
//                             <>
//                                 {/* Mobile Modal Player */}
//                                 {isPlayerModalOpen && (
//                                     <div className={styles.playerModal} onClick={() => setIsPlayerModalOpen(false)}>
//                                         <div className={styles.playerModalContent} onClick={(e) => e.stopPropagation()}>
//                                             <img src={currentSong.cover} alt={currentSong.title} className={styles.modalCover} />
//                                             <div className={styles.modalInfo}>
//                                                 <h2 className={styles.modalTitle}>{currentSong.title}</h2>
//                                                 <p className={styles.modalArtist}>{currentSong.artist}</p>
//                                             </div>
//                                             <div className={styles.modalControls}>
//                                                 <FaStepBackward className={styles.modalControlIcon} onClick={playPreviousSong} />
//                                                 <div className={styles.modalPlayBtn} onClick={togglePlayPause}>
//                                                     {isPlaying ? <FaPause /> : <FaPlay />}
//                                                 </div>
//                                                 <FaStepForward className={styles.modalControlIcon} onClick={playNextSong} />
//                                             </div>
//                                             <div className={styles.modalProgressContainer}>
//                                                 <span className={styles.timeText}>{formatTime(currentTime)}</span>
//                                                 <div
//                                                     className={styles.progressBar}
//                                                     onClick={handleProgressBarClick}
//                                                 >
//                                                     <div
//                                                         className={styles.progressFill}
//                                                         style={{ width: `${progress}%` }}
//                                                     ></div>
//                                                 </div>
//                                                 <span className={styles.timeText}>{formatTime(duration)}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Player Card */}
//                                 <div className={styles.playerContainer} onClick={() => setIsPlayerModalOpen(true)}>
//                                     <div className={styles.playerCard}>
//                                         <img src={currentSong.cover} alt={currentSong.title} className={styles.largeCover} />
//                                         <div className={styles.playerInfo}>
//                                             <h3>{currentSong.title}</h3>
//                                             <p>{currentSong.artist}</p>
//                                         </div>
//                                         <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
//                                             <FaStepBackward className={styles.controlIcon} onClick={playPreviousSong} />
//                                             <div className={styles.playBtn} onClick={togglePlayPause}>
//                                                 {isPlaying ? <FaPause /> : <FaPlay />}
//                                             </div>
//                                             <FaStepForward className={styles.controlIcon} onClick={playNextSong} />
//                                         </div>
//                                         <div className={styles.progressContainer} onClick={(e) => e.stopPropagation()}>
//                                             <span className={styles.timeText}>{formatTime(currentTime)}</span>
//                                             <div
//                                                 className={styles.progressBar}
//                                                 onClick={handleProgressBarClick}
//                                             >
//                                                 <div
//                                                     className={styles.progressFill}
//                                                     style={{ width: `${progress}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className={styles.timeText}>{formatTime(duration)}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 ) : active === 'Trends' ? (
//                     <div className={styles.centeredContent}>
//                         <h2>Trending Now</h2>
//                         <p>Check out what's popular!</p>
//                     </div>
//                 ) : active === 'Discover' ? (
//                     <div className={styles.centeredContent}>
//                         <h2>Discover</h2>
//                         <p>Find new music you'll love!</p>
//                     </div>
//                 ) : (
//                     <div className={styles.centeredContent}>
//                         <h2>{active}</h2>
//                         <p>Content for {active}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default MiddlePage;
import styles from "./MiddlePage.module.css";
import { GoHomeFill } from "react-icons/go";
import { FaFire, FaCompass, FaCog, FaBars, FaPlay, FaPause, FaStepForward, FaStepBackward, FaCloudUploadAlt, FaHeart, FaPlus, FaEllipsisV } from "react-icons/fa";
import { MdLibraryMusic, MdEvent, MdAlbum, MdPlaylistPlay } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadPage from "./UploadPage";
import AlbumPage from "./AlbumPage";

const MiddlePage = ({
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    songs,
    setSongs,
    albums,
    setActivePage,
    activePage,
    progress,
    currentTime,
    duration,
    audioRef,
    searchQuery
}) => {

    const [active, setActive] = useState("Home");
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const navigate = useNavigate();

    // Auto-switch to Discover on search
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            setActive("Discover");
        }
    }, [searchQuery]);

    // Fetch User Data (Liked Songs & Playlists)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data...");
                const [likedRes, playlistRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/user/liked-songs"),
                    axios.get("http://localhost:5000/api/playlists/my-playlists")
                ]);

                console.log("Liked Songs Response:", likedRes.data);
                console.log("Playlists Response:", playlistRes.data);

                if (likedRes.data.success) {
                    // Map backend song objects to frontend format if needed, or assume consistent
                    // Here we assume the backend returns populated song objects that match frontend structure
                    // We might need to map them if structure differs. 
                    // Let's assume for now they are similar but check coverUrl vs cover
                    const formattedLiked = likedRes.data.likedSongs.map(s => ({
                        ...s,
                        id: s._id,
                        cover: s.coverUrl,
                        audio: s.audioUrl
                    }));
                    console.log("Formatted Liked Songs:", formattedLiked);
                    setLikedSongs(formattedLiked);
                }

                if (playlistRes.data.success) {
                    setPlaylists(playlistRes.data.playlists);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

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

    const handleMenuClick = (page) => {
        if (page === "Create Album") {
            navigate('/create-album');
            return;
        }
        setActive(page);
        setActivePage(page);
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
            console.log("Creating playlist:", newPlaylistName);
            const res = await axios.post("http://localhost:5000/api/playlists/create", { title: newPlaylistName });
            console.log("Create Playlist Response:", res.data);
            if (res.data.success) {
                setPlaylists([...playlists, res.data.playlist]);
                setNewPlaylistName("");
                setShowPlaylistModal(false);
                alert("Playlist created successfully!");
            }
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist: " + (error.response?.data?.message || error.message));
        }
    };

    const handleAlbumClick = (albumId) => {
        setSelectedAlbumId(albumId);
        setActive("AlbumView");
    };

    const handleSongClick = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    const playNextSong = () => {
        // Logic depends on current list (all songs, liked, playlist)
        // For simplicity, using 'songs' prop as main list for now, 
        // but ideally should track 'currentQueue'
        const index = songs.findIndex((s) => s.id === currentSong.id);
        const next = (index + 1) % songs.length;
        setCurrentSong(songs[next]);
        setIsPlaying(true);
    };

    const playPreviousSong = () => {
        const index = songs.findIndex((s) => s.id === currentSong.id);
        const prev = (index - 1 + songs.length) % songs.length;
        setCurrentSong(songs[prev]);
        setIsPlaying(true);
    };

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

    // --- Song Options Handlers ---
    const addToLiked = async (song) => {
        try {
            console.log("Toggling like for song:", song.id);
            const res = await axios.post("http://localhost:5000/api/user/like-song", { songId: song.id });
            console.log("Toggle Like Response:", res.data);
            if (res.data.success) {
                // Update local liked songs state
                if (res.data.isLiked) {
                    setLikedSongs(prev => [...prev, { ...song, cover: song.cover || song.coverUrl, audio: song.audio || song.audioUrl }]);
                } else {
                    setLikedSongs(prev => prev.filter(s => s.id !== song.id));
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const addToPlaylist = async (playlistId, songId) => {
        try {
            console.log("Adding song:", songId, "to playlist:", playlistId);
            const res = await axios.post("http://localhost:5000/api/playlists/add-song", { playlistId, songId });
            console.log("Add to Playlist Response:", res.data);
            if (res.data.success) {
                alert("Added to playlist!");
                // Update local playlist state if needed
            }
        } catch (error) {
            console.error("Error adding to playlist:", error);
            alert(error.response?.data?.message || "Error adding to playlist");
        }
    };

    return (
        <div className={styles.outer}>
            {/* Sidebar */}
            <div className={`${styles.left} ${isCollapsed ? styles.collapsed : ""}`}>
                <div className={styles.toggleBtn} onClick={toggleSidebar}>
                    <FaBars className={styles.icon} />
                </div>

                <div className={styles.menuSection}>
                    {!isCollapsed && <p className={styles.menuTitle}>Menu</p>}
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className={`${styles.item} ${active === item.name && active !== 'AlbumView' && active !== 'PlaylistView' ? styles.active : ""}`}
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


            </div>

            {/* ---------------- RIGHT SIDE CONTENT ---------------- */}
            <div className={styles.right}>
                {/* Playlist Creation Modal */}
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



                {/* Upload Page */}
                {active === "Upload" && (
                    <UploadPage songs={songs} setSongs={setSongs} />
                )}

                {/* Album View */}
                {active === "AlbumView" && selectedAlbumId && (
                    <AlbumPage
                        albumId={selectedAlbumId}
                        onBack={() => setActive("Home")}
                        setCurrentSong={setCurrentSong}
                        setIsPlaying={setIsPlaying}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        songs={songs}
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
                    />
                )}

                {/* Playlist View */}
                {active === "PlaylistView" && selectedPlaylist && (
                    <SongListSection
                        title={selectedPlaylist.title}
                        songs={selectedPlaylist.songs.map(s => ({ ...s, id: s._id, cover: s.coverUrl, audio: s.audioUrl }))} // Map populated songs
                        currentSong={currentSong}
                        handleSongClick={handleSongClick}
                        draggedIndex={draggedIndex}
                        setDraggedIndex={setDraggedIndex}
                        playPreviousSong={playPreviousSong}
                        playNextSong={playNextSong}
                        isPlayerModalOpen={isPlayerModalOpen}
                        setIsPlayerModalOpen={setIsPlayerModalOpen}
                        togglePlayPause={togglePlayPause}
                        isPlaying={isPlaying}
                        formatTime={formatTime}
                        currentTime={currentTime}
                        duration={duration}
                        handleProgressBarClick={handleProgressBarClick}
                        progress={progress}
                        likedSongs={likedSongs}
                        addToLiked={addToLiked}
                        playlists={playlists}
                        addToPlaylist={addToPlaylist}
                        setShowPlaylistModal={setShowPlaylistModal}
                    />
                )}

                {/* Liked Songs Page */}
                {active === "Liked Songs" && (
                    <SongListSection
                        title="Liked Songs"
                        songs={likedSongs}
                        currentSong={currentSong}
                        handleSongClick={handleSongClick}
                        draggedIndex={draggedIndex}
                        setDraggedIndex={setDraggedIndex}
                        playPreviousSong={playPreviousSong}
                        playNextSong={playNextSong}
                        isPlayerModalOpen={isPlayerModalOpen}
                        setIsPlayerModalOpen={setIsPlayerModalOpen}
                        togglePlayPause={togglePlayPause}
                        isPlaying={isPlaying}
                        formatTime={formatTime}
                        currentTime={currentTime}
                        duration={duration}
                        handleProgressBarClick={handleProgressBarClick}
                        progress={progress}
                        likedSongs={likedSongs}
                        addToLiked={addToLiked}
                        playlists={playlists}
                        addToPlaylist={addToPlaylist}
                        setShowPlaylistModal={setShowPlaylistModal}
                    />
                )}

                {/* Library Page -> NOW SHOWS LIKED SONGS (Personal) */}
                {active === "Library" && (
                    <SongListSection
                        title="Your Library"
                        songs={likedSongs}
                        currentSong={currentSong}
                        handleSongClick={handleSongClick}
                        draggedIndex={draggedIndex}
                        setDraggedIndex={setDraggedIndex}
                        playPreviousSong={playPreviousSong}
                        playNextSong={playNextSong}
                        isPlayerModalOpen={isPlayerModalOpen}
                        setIsPlayerModalOpen={setIsPlayerModalOpen}
                        togglePlayPause={togglePlayPause}
                        isPlaying={isPlaying}
                        formatTime={formatTime}
                        currentTime={currentTime}
                        duration={duration}
                        handleProgressBarClick={handleProgressBarClick}
                        progress={progress}
                        likedSongs={likedSongs}
                        addToLiked={addToLiked}
                        playlists={playlists}
                        addToPlaylist={addToPlaylist}
                        setShowPlaylistModal={setShowPlaylistModal}
                    />
                )}

                {/* Home Page – ALBUMS + SONGS */}
                {active === "Home" && (
                    <>
                        {/* ALBUMS SECTION */}
                        {albums && albums.length > 0 ? (
                            <div className={styles.libraryContent} style={{ marginBottom: '20px' }}>
                                <div className={styles.songListContainer}>
                                    <h2 className={styles.sectionTitle}>Your Albums</h2>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingBottom: '10px' }}>
                                        {albums.map(album => (
                                            <div
                                                key={album._id}
                                                onClick={() => handleAlbumClick(album._id)}
                                                style={{ width: '160px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <img
                                                    src={album.coverUrl}
                                                    alt={album.title}
                                                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                                                />
                                                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.title}</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-color)', opacity: 0.7, margin: 0 }}>
                                                    {album.releaseDate ? new Date(album.releaseDate).getFullYear() : ''}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.centeredContent}>
                                <h2>No Albums Found</h2>
                                <p>Create a new album to get started!</p>
                            </div>
                        )}

                        {/* GLOBAL SONGS ON HOME TOO? Optional, but commonly Home is a mix. 
                            For now, let's leave Home as Albums-focused or add a "Recent Uploads" section if requested. 
                            The user specially asked for "Discover" to have global songs. 
                        */}
                    </>
                )}

                {/* Trends Page */}
                {active === "Trends" && (
                    <div className={styles.libraryContent}>
                        <div className={styles.songListContainer}>
                            <h2 className={styles.sectionTitle}>Trending Folders</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                {['Global Top 50', 'Viral Hits', 'Pop Rising', 'Hip-Hop Mix', 'Chill Vibes', 'Workout Energy'].map((trend, i) => (
                                    <div key={i} className={styles.playerCard} style={{
                                        height: '180px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 60%), hsl(${i * 60 + 30}, 70%, 40%))`,
                                        cursor: 'pointer'
                                    }}>
                                        <FaFire style={{ fontSize: '40px', marginBottom: '10px', color: 'white' }} />
                                        <h3 style={{ margin: 0, textAlign: 'center' }}>{trend}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Discover Page -> NOW SHOWS ALL GLOBAL SONGS */}
                {active === "Discover" && (
                    <SongListSection
                        title={searchQuery ? `Search Results for "${searchQuery}"` : "Discover New Music"}
                        songs={
                            searchQuery
                                ? songs.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase()))
                                : songs
                        }
                        currentSong={currentSong}
                        handleSongClick={handleSongClick}
                        draggedIndex={draggedIndex}
                        setDraggedIndex={setDraggedIndex}
                        playPreviousSong={playPreviousSong}
                        playNextSong={playNextSong}
                        isPlayerModalOpen={isPlayerModalOpen}
                        setIsPlayerModalOpen={setIsPlayerModalOpen}
                        togglePlayPause={togglePlayPause}
                        isPlaying={isPlaying}
                        formatTime={formatTime}
                        currentTime={currentTime}
                        duration={duration}
                        handleProgressBarClick={handleProgressBarClick}
                        progress={progress}
                        likedSongs={likedSongs}
                        addToLiked={addToLiked}
                        playlists={playlists}
                        addToPlaylist={addToPlaylist}
                        setShowPlaylistModal={setShowPlaylistModal}
                    />
                )}
            </div>
        </div>
    );
};

// ---------------- REUSABLE SONG LIST COMPONENT ---------------- //
const SongListSection = ({
    title,
    songs,
    currentSong,
    handleSongClick,
    draggedIndex,
    setDraggedIndex,
    playPreviousSong,
    playNextSong,
    isPlayerModalOpen,
    setIsPlayerModalOpen,
    togglePlayPause,
    isPlaying,
    formatTime,
    currentTime,
    duration,
    handleProgressBarClick,
    progress,
    likedSongs,
    addToLiked,
    playlists,
    addToPlaylist,
    setShowPlaylistModal
}) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [subMenuOpenId, setSubMenuOpenId] = useState(null);

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
        setSubMenuOpenId(null);
    };

    const handleSubMenuEnter = (id) => {
        setSubMenuOpenId(id);
    };

    const handleSubMenuLeave = () => {
        setSubMenuOpenId(null);
    };

    return (
        <div className={styles.libraryContent}>
            <div className={styles.songListContainer}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <div className={styles.songList}>
                    {songs && songs.map((song, index) => (
                        <div
                            key={song.id}
                            className={`${styles.songItem} 
                            ${currentSong?.id === song.id ? styles.playing : ""} 
                            ${draggedIndex === index ? styles.dragging : ""}`}
                            onClick={() => handleSongClick(song)}
                            draggable
                        >
                            <img src={song.cover} alt={song.title} className={styles.songCover} />
                            <div className={styles.songInfo}>
                                <p className={styles.songTitle}>{song.title}</p>
                                <p className={styles.songArtist}>{song.artist}</p>
                            </div>
                            <span className={styles.songDuration}>{song.duration}</span>

                            {/* Song Options */}
                            <div className={styles.songOptions}>
                                {likedSongs?.some(s => s.id === song.id) && <FaHeart className={styles.likedIcon} />}
                                <div className={styles.menuContainer}>
                                    <FaEllipsisV className={styles.menuIcon} onClick={(e) => toggleMenu(e, song.id)} />
                                    {openMenuId === song.id && (
                                        <div className={styles.dropdownMenu} onMouseLeave={() => setOpenMenuId(null)}>

                                            {/* Add to Playlist (Nested) */}
                                            <div
                                                className={styles.menuItem}
                                                onMouseEnter={() => handleSubMenuEnter(song.id)}
                                                onMouseLeave={handleSubMenuLeave}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <span>Add to playlist</span>
                                                    <span style={{ fontSize: '10px' }}>▶</span>
                                                </div>

                                                {subMenuOpenId === song.id && (
                                                    <div className={styles.subMenu}>
                                                        {/* New Playlist Option */}
                                                        <div className={styles.subMenuItem} onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowPlaylistModal(true);
                                                            setOpenMenuId(null);
                                                        }}>
                                                            <FaPlus style={{ marginRight: '8px', fontSize: '10px' }} /> New playlist
                                                        </div>
                                                        <div className={styles.divider}></div>

                                                        {/* Existing Playlists */}
                                                        {playlists?.map(pl => (
                                                            <div key={pl._id} className={styles.subMenuItem} onClick={(e) => {
                                                                e.stopPropagation();
                                                                console.log("Adding song:", song.id, "to playlist:", pl._id);
                                                                addToPlaylist(pl._id, song.id);
                                                                setOpenMenuId(null);
                                                            }}>
                                                                {pl.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Like / Remove Like */}
                                            <div className={styles.menuItem} onClick={(e) => { e.stopPropagation(); addToLiked(song); setOpenMenuId(null); }}>
                                                {likedSongs?.some(s => s.id === song.id) ? (
                                                    <><span style={{ color: '#1ed760', marginRight: '8px' }}>✔</span> Remove from your Liked Songs</>
                                                ) : (
                                                    "Add to Liked Songs"
                                                )}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PLAYER CARD & MODAL */}
            {currentSong && (
                <>
                    {/* Modal Player (Overlay) */}
                    {isPlayerModalOpen && (
                        <div className={styles.playerModal} onClick={() => setIsPlayerModalOpen(false)}>
                            <div className={styles.playerModalContent} onClick={(e) => e.stopPropagation()}>
                                <img src={currentSong.cover} alt={currentSong.title} className={styles.modalCover} />
                                <div className={styles.modalInfo}>
                                    <h2 className={styles.modalTitle}>{currentSong.title}</h2>
                                    <p className={styles.modalArtist}>{currentSong.artist}</p>
                                </div>
                                <div className={styles.modalControls}>
                                    <FaStepBackward className={styles.modalControlIcon} onClick={playPreviousSong} />
                                    <div className={styles.modalPlayBtn} onClick={togglePlayPause}>
                                        {isPlaying ? <FaPause /> : <FaPlay />}
                                    </div>
                                    <FaStepForward className={styles.modalControlIcon} onClick={playNextSong} />
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

                    {/* Small Player Card */}
                    <div
                        className={styles.playerContainer}
                        onClick={() => setIsPlayerModalOpen(true)}
                    >
                        <div className={styles.playerCard}>
                            <img src={currentSong.cover} className={styles.largeCover} />

                            <div className={styles.playerInfo}>
                                <h3>{currentSong.title}</h3>
                                <p>{currentSong.artist}</p>
                            </div>

                            <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
                                <FaStepBackward className={styles.controlIcon} onClick={playPreviousSong} />
                                <div className={styles.playBtn} onClick={togglePlayPause}>
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </div>
                                <FaStepForward className={styles.controlIcon} onClick={playNextSong} />
                            </div>

                            <div
                                className={styles.progressContainer}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className={styles.timeText}>{formatTime(currentTime)}</span>
                                <div className={styles.progressBar} onClick={handleProgressBarClick}>
                                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                </div>
                                <span className={styles.timeText}>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
};

const CenterText = ({ title, desc }) => (
    <div className={styles.centeredContent}>
        <h2>{title}</h2>
        <p>{desc}</p>
    </div>
);

export default MiddlePage;
