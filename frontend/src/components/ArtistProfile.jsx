
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
    // Filter albums for this artist (for display in Albums section)
    // We use the first name for broader matching (e.g. "Anirudh" matches "Anirudh Ravichander")
    const normalize = (str) => str ? str.toLowerCase() : '';
    const searchName = normalize(artist.name.split(' ')[0]);
    const matches = (text) => normalize(text).includes(searchName);

    const artistAlbums = albums ? albums.filter(album =>
        matches(album.artist) || matches(album.description)
    ) : [];

    // Collect all song IDs from these albums (Reverse Lookup)
    // This handles cases where song.album is null, but the Album document has the song ID.
    const artistAlbumSongIds = new Set();
    artistAlbums.forEach(album => {
        if (album.songs && Array.isArray(album.songs)) {
            album.songs.forEach(songId => {
                // songId might be an object (if populated) or string/ObjectId
                const id = typeof songId === 'object' ? songId._id : songId;
                artistAlbumSongIds.add(String(id));
            });
        }
    });

    // Robust filtering logic
    const artistSongs = songs.filter(song => {
        // 1. Check Song Artist (String)
        if (matches(song.artist)) return true;

        // 2. Check Song Artists (Array)
        if (song.artists && song.artists.some(a => matches(a))) return true;

        // 3. Check if Song is in one of the Artist's Albums (Reverse Lookup)
        // We use String() to ensure we match ObjectId to string comparisons correctly
        if (artistAlbumSongIds.has(String(song._id)) || artistAlbumSongIds.has(String(song.id))) return true;

        // 4. Check Album metadata linked from Song (Forward Lookup)
        let albumObj = null;
        if (song.album) {
            // Check if song.album is already populated object
            if (typeof song.album === 'object' && (song.album.description || song.album.artist)) {
                albumObj = song.album;
            }
            // Else try to find it in the albums prop
            else if (albums) {
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

    const handleShufflePlay = () => {
        if (artistSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * artistSongs.length);
            onSongClick(artistSongs[randomIndex]);
        }
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
                <img src={artist.image} alt={artist.name} className={styles.spotlightImage} />
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
