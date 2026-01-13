import { useState, useRef, useEffect } from "react";
import styles from "./HomeDashboard.module.css";
import { FaPlay, FaHeart, FaMobileAlt, FaFan, FaPlus } from "react-icons/fa";
import { MdAlbum } from "react-icons/md";
import AddArtistModal from "./AddArtistModal";

// Initial static artists can be removed or kept as fallback
// const ARTISTS = [ ... ]; 

const HomeDashboard = ({
    albums,
    onAlbumClick,
    setActive,
    onPlayArtist, // New prop
    user
}) => {
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const albumsRef = useRef(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const fetchArtists = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/actors`);
            const data = await res.json();
            if (data.ok && data.actors.length > 0) {
                setArtists(data.actors);
                // Set default selected artist if none selected or ensuring persistence
                if (!selectedArtist) setSelectedArtist(data.actors[0]);
            }
        } catch (error) {
            console.error("Failed to fetch artists", error);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleArtistAdded = () => {
        fetchArtists();
    };

    const getImageUrl = (url) => {
        if (!url) return "/img/Anirudh.jpg"; // Fallback
        if (url.startsWith("http")) return url;
        return `${API_BASE}${url}`;
    };

    const scrollToAlbums = () => {
        albumsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Quick Access Grid (Mobile Only) */}
            <div className={styles.quickAccessGrid}>
                <div className={styles.quickCard} onClick={() => setActive("Liked Songs")}>
                    <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(29, 185, 84, 0.2)', color: '#1db954' }}>
                        <FaHeart />
                    </div>
                    <div className={styles.cardText}>
                        <h3>Liked Songs</h3>
                        <span>Your Favorites</span>
                    </div>
                </div>

                <div className={styles.quickCard} onClick={scrollToAlbums}>
                    <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(255, 153, 0, 0.2)', color: '#ff9900' }}>
                        <MdAlbum />
                    </div>
                    <div className={styles.cardText}>
                        <h3>Available Albums</h3>
                        <span>{albums.length} Albums</span>
                    </div>
                </div>

                <div className={styles.quickCard} onClick={() => setActive("Discover")}>
                    <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(54, 162, 235, 0.2)', color: '#36a2eb' }}>
                        <FaMobileAlt />
                    </div>
                    <div className={styles.cardText}>
                        <h3>Latest Songs</h3>
                        <span>Trending Now</span>
                    </div>
                </div>

                <div className={styles.quickCard} onClick={() => setActive("MoodAnalyser")}>
                    <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(153, 102, 255, 0.2)', color: '#9966ff' }}>
                        <FaFan />
                    </div>
                    <div className={styles.cardText}>
                        <h3>Mood Analyser</h3>
                        <span>AI Assistant</span>
                    </div>
                </div>
            </div>


            {/* Artist Circles Row */}
            <div className={styles.artistSection}>
                {/* <h2 className={styles.sectionTitle}>Your Artists</h2> */}
                <div className={styles.artistRow}>
                    {artists.map((artist) => (
                        <div
                            key={artist._id}
                            className={`${styles.artistCircle} ${selectedArtist?._id === artist._id ? styles.active : ''}`}
                            onClick={() => setSelectedArtist(artist)}
                        >
                            <div className={styles.artistImageWrapper}>
                                <img src={getImageUrl(artist.photoUrl)} alt={artist.name} />
                            </div>
                            <span className={styles.artistName}>{artist.name}</span>
                        </div>
                    ))}

                    {/* Add Artist Button */}
                    <div className={styles.artistCircle} onClick={() => setIsModalOpen(true)}>
                        <div className={styles.artistImageWrapper} style={{ backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaPlus style={{ fontSize: '30px', color: '#888' }} />
                        </div>
                        <span className={styles.artistName}>Add Artist</span>
                    </div>
                </div>
            </div>

            {/* Artist Spotlight (Dynamic) */}
            {selectedArtist && (
                <div className={styles.spotlightSection} key={selectedArtist._id}>
                    <img src={getImageUrl(selectedArtist.photoUrl)} alt={selectedArtist.name} className={styles.spotlightImage} />
                    <div className={styles.spotlightInfo}>
                        <div className={styles.spotlightHeader}>
                            <h2>{selectedArtist.name}</h2>
                        </div>
                        <div className={styles.spotlightStats}>
                            <p>{selectedArtist.bio}</p>
                            <p>•</p>
                            <p>{selectedArtist.stats}</p>
                        </div>
                        <div className={styles.spotlightActions}>
                            <button className={styles.playArtistBtn} onClick={() => onPlayArtist(selectedArtist)}>
                                <FaPlay style={{ marginRight: '8px', fontSize: '12px' }} />
                                Play
                            </button>
                            <button className={styles.followBtn}>Follow</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Your Albums */}
            <div className={styles.artistSection} ref={albumsRef}>
                <h2 className={styles.sectionTitle}>Your Albums</h2>
                <div className={styles.albumGrid}>
                    {albums.map(album => (
                        <div key={album._id} className={styles.albumCard} onClick={() => onAlbumClick(album._id)}>
                            <div className={styles.albumCoverWrapper}>
                                <img src={album.coverUrl} alt={album.title} />
                            </div>
                            <h4>{album.title}</h4>
                        </div>
                    ))}
                </div>
            </div>

            <AddArtistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onArtistAdded={handleArtistAdded}
            />
        </div >
    );
};

export default HomeDashboard;
