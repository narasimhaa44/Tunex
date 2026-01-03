
import "./HomePage.module.css";
import Header from "./Header.jsx";
import MiddlePage from "./MiddlePage.jsx";
import MusicPlayer from "./MusicPlayer.jsx";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// Send cookies for authentication every time
axios.defaults.withCredentials = true;

const Home = () => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activePage, setActivePage] = useState("Home");
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

    // Fetch songs FROM BACKEND
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsRes, albumsRes] = await Promise.all([
                    axios.get("https://tunex-15at.onrender.com/api/songs/all"),
                    axios.get("https://tunex-15at.onrender.com/api/albums")
                ]);

                console.log("Fetched songs:", songsRes.data.songs);
                console.log("Fetched albums:", albumsRes.data.albums);

                if (songsRes.data.songs) {
                    // Convert backend URLs into frontend format
                    const formatted = songsRes.data.songs.map((s, index) => ({
                        id: s._id || index + 1,
                        title: s.title,
                        artist: s.artist,
                        duration: s.duration,
                        cover: s.coverUrl,
                        audio: s.audioUrl
                    }));



                    setSongs(prev => [...prev, ...formatted]);
                }

                if (albumsRes.data.albums) {
                    setAlbums(albumsRes.data.albums);
                }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Playing / pausing logic
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(err => console.error("Play failed:", err));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    // Progress bar listener
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
        };
    }, [currentSong]);

    // Next song
    const playNextSong = () => {
        const index = songs.findIndex((s) => s.id === currentSong.id);
        const next = (index + 1) % songs.length;
        setCurrentSong(songs[next]);
        setIsPlaying(true);
    };

    return (
        <>
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <MiddlePage
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                songs={songs}
                setSongs={setSongs}
                albums={albums}
                setActivePage={setActivePage}
                activePage={activePage}
                progress={progress}
                currentTime={currentTime}
                duration={duration}
                audioRef={audioRef}
                searchQuery={searchQuery}
            />

            {/* Music player bar only in non-list pages */}
            {activePage !== "Library" && activePage !== "Home" && currentSong && (
                <MusicPlayer
                    currentSong={currentSong}
                    setCurrentSong={setCurrentSong}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    songs={songs}
                    progress={progress}
                    currentTime={currentTime}
                    duration={duration}
                    audioRef={audioRef}
                />
            )}

            {currentSong && (
                <audio ref={audioRef} src={currentSong.audio} onEnded={playNextSong} />
            )}
        </>
    );
};

export default Home;
