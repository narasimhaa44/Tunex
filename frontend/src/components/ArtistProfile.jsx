
import React from 'react';
import styles from './HomeDashboard.module.css'; // Reusing Home styles for now or create new
import { FaPlay, FaHeart } from 'react-icons/fa';
import SwipeableSongItem from './SwipeableSongItem';

const ArtistProfile = ({
    artist,
    songs,
    albums,
    onAlbumClick,
    onQueue,
    currentSong,
    onSongClick,
    onBack
}) => {
    // State for songs to display
    const [artistSongs, setArtistSongs] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    // Reusing existing logic to filter local songs as fallback
    const getLocalArtistSongs = () => {
        const normalize = (str) => str ? str.toLowerCase().trim() : '';
        const searchName = normalize(artist.name);

        const matches = (text) => {
            if (!text) return false;
            const normText = normalize(text);
            return normText.includes(searchName) || searchName.includes(normText);
        };

        const artistAlbums = albums ? albums.filter(album =>
            matches(album.artist) || matches(album.description)
        ) : [];

        const artistAlbumSongIds = new Set();
        artistAlbums.forEach(album => {
            if (album.songs && Array.isArray(album.songs)) {
                album.songs.forEach(songId => {
                    const id = typeof songId === 'object' ? songId._id : songId;
                    artistAlbumSongIds.add(String(id));
                });
            }
        });

        return songs.filter(song => {
            if (matches(song.artist)) return true;
            if (song.artists && song.artists.some(a => matches(a))) return true;
            if (artistAlbumSongIds.has(String(song._id)) || artistAlbumSongIds.has(String(song.id))) return true;

            let albumObj = null;
            if (song.album) {
                if (typeof song.album === 'object' && (song.album.description || song.album.artist)) {
                    albumObj = song.album;
                } else if (albums) {
                    const albumId = typeof song.album === 'object' ? song.album._id : song.album;
                    albumObj = albums.find(a => a._id === albumId);
                }
            }

            if (albumObj) {
                if (matches(albumObj.artist)) return true;
                if (matches(albumObj.description)) return true;
            }

            return false;
        });
    };

    // Fetch songs when artist changes
    React.useEffect(() => {
        if (!artist || !artist.name) return; // Safety check

        const fetchArtistSongs = async () => {
            setIsLoading(true);

            // 1. Get Local Songs (Fallback)
            const localSongs = getLocalArtistSongs();
            setArtistSongs(localSongs); // Show local immediately while fetching

            // 2. Try Fetching from Spotify
            try {
                // Use fetch/axios to call our backend
                // Simple fetch for now
                const response = await fetch(`${API_BASE}/api/spotify/artist-latest/${encodeURIComponent(artist.name)}`);
                const data = await response.json();

                if (data.success && data.songs.length > 0) {
                    console.log(`Fetched ${data.songs.length} songs for ${artist.name} from Spotify`);

                    // Normalize Spotify songs to match app structure
                    const formattedSongs = data.songs.map(s => ({
                        ...s,
                        id: s._id,
                        cover: s.coverUrl,
                        audio: s.previewKey || s.audioUrl, // Ensure audio property exists
                        artist: s.artist || artist.name,
                        album: s.album || "Single"
                    }));

                    setArtistSongs(formattedSongs); // REPLACE local with Spotify results
                } else {
                    console.log("No Spotify songs found, keeping local fallback.");
                }

            } catch (error) {
                console.error("Error fetching artist songs from Spotify:", error);
                // Keep local songs on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtistSongs();
    }, [artist]); // Dependencies: ONLY artist, to prevent infinite loops

    const handleShufflePlay = () => {
        if (artistSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * artistSongs.length);
            onSongClick(artistSongs[randomIndex]);
        }
    };


    const getImageUrl = (url) => {
        if (!url) return "/img/Anirudh.jpg"; // Fallback
        if (url.startsWith("http")) return url;
        // If it starts with /img, it's a static frontend asset
        if (url.startsWith("/img")) return url;
        // Otherwise it's a backend upload
        return `${API_BASE}${url}`;
    };

    return (
        <div className={styles.dashboardContainer}>
            <button onClick={onBack} style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-color)',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '20px',
                alignSelf: 'flex-start'
            }}>
                ← Back
            </button>

            <div className={styles.spotlightSection} style={{ marginTop: 0 }}>
                <img src={getImageUrl(artist.photoUrl || artist.image)} alt={artist.name} className={styles.spotlightImage} />
                <div className={styles.spotlightInfo}>
                    <div className={styles.spotlightHeader}>
                        <h2>{artist.name}</h2>
                    </div>
                    <div className={styles.spotlightStats}>
                        <p>{artist.bio}</p>
                        <p>•</p>
                        <p>{artist.stats}</p>
                    </div>
                    <div className={styles.spotlightActions}>
                        <button className={styles.playArtistBtn}>
                            <FaPlay style={{ marginRight: '8px', fontSize: '12px' }} />
                            Play
                        </button>
                        <button className={styles.followBtn}>Follow</button>
                    </div>
                </div>
            </div>

            <div className={styles.artistSection} style={{ marginTop: '30px' }}>
                <h3 className={styles.sectionTitle}>Songs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {artistSongs.length > 0 ? (
                        artistSongs.map((song, index) => (
                            <SwipeableSongItem
                                key={song._id || song.id || index}
                                song={song}
                                isActive={currentSong && (currentSong.id === song.id || currentSong._id === song._id)}
                                onClick={() => onSongClick(song)}
                                onQueue={() => onQueue(song)}
                                index={index}
                                className={`${styles.songCard} ${currentSong && (currentSong.id === song.id || currentSong._id === song._id) ? styles.active : ''}`}
                            >
                                <span className={styles.songNumber}>{index + 1}</span>
                                <img src={song.coverUrl || song.cover} alt={song.title} className={styles.songCover} />
                                <div className={styles.songInfo}>
                                    <h4 className={styles.songTitle}>{song.title}</h4>
                                    <p className={styles.songArtist}>{song.artist}</p>
                                </div>
                                <span className={styles.songDuration}>{song.duration}</span>
                            </SwipeableSongItem>
                        ))
                    ) : (
                        <p style={{ color: '#888' }}>No songs found for this artist.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
