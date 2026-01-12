import { useState, useRef } from "react";
import styles from "./HomeDashboard.module.css";
import { FaPlay, FaHeart, FaMobileAlt, FaFan } from "react-icons/fa";
import { MdAlbum } from "react-icons/md";

// Placeholder data for artists - User will update these images
const ARTISTS = [
    {
        id: 1,
        name: "Anirudh Ravichandran",
        image: "/img/Anirudh.jpg",
        stats: "Monthly Listeners: 12M",
        bio: "The Rockstar of South Indian Cinema."
    },
    {
        id: 2,
        name: "A.R. Rahman",
        image: "/img/Rehaman.jpeg",
        stats: "Monthly Listeners: 28M",
        bio: "The Mozart of Madras."
    },
    {
        id: 3,
        name: "Sid Sriram",
        image: "/img/Sidsriram.jpg",
        stats: "Monthly Listeners: 8M",
        bio: "Soulful voice behind many hits."
    },
    {
        id: 4,
        name: "Shreya Ghoshal",
        image: "/img/Shreya.jpg",
        stats: "Monthly Listeners: 20M",
        bio: "The melody queen."
    },
    {
        id: 5,
        name: "Thaman S",
        image: "/img/Thaman.jpg",
        stats: "Monthly Listeners: 7M",
        bio: "Dynamic composer."
    },
    {
        id: 6,
        name: "Sinjith Yerramilli",
        image: "/img/Sinjith-Yerramilli.jpg",
        stats: "Monthly Listeners: 20M",
        bio: "The melody queen."
    }
];

const HomeDashboard = ({
    albums,
    onAlbumClick,
    setActive,
    onPlayArtist, // New prop
    user
}) => {
    const [selectedArtist, setSelectedArtist] = useState(ARTISTS[0]);
    const albumsRef = useRef(null);

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
                    {ARTISTS.map((artist) => (
                        <div
                            key={artist.id}
                            className={`${styles.artistCircle} ${selectedArtist.id === artist.id ? styles.active : ''}`}
                            onClick={() => setSelectedArtist(artist)}
                        >
                            <div className={styles.artistImageWrapper}>
                                <img src={artist.image} alt={artist.name} />
                            </div>
                            <span className={styles.artistName}>{artist.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Artist Spotlight (Dynamic) */}
            <div className={styles.spotlightSection} key={selectedArtist.id}>
                <img src={selectedArtist.image} alt={selectedArtist.name} className={styles.spotlightImage} />
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
        </div>
    );
};

export default HomeDashboard;
