
import "./HomePage.module.css";
import Header from "./Header.jsx";
import MiddlePage from "./MiddlePage.jsx";
import MusicPlayer from "./MusicPlayer.jsx";
import { useState, useRef, useEffect } from "react";
import api from "../api/api";

const Home = () => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activePage, setActivePage] = useState("Home"); // Centralized active page state
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // Enhanced Navigation with History
    const handleNavigation = (page) => {
        if (page === activePage) return;
        window.history.pushState({ page }, "", `#${page}`);
        setActivePage(page);
    };

    useEffect(() => {
        // Initial load: replace state to ensure back works correctly
        window.history.replaceState({ page: "Home" }, "", "#Home");

        const handlePopState = (event) => {
            if (event.state && event.state.page) {
                setActivePage(event.state.page);
            } else {
                setActivePage("Home");
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const [allSongs, setAllSongs] = useState([]); // ⭐ GLOBAL COLLECTION
    const [playbackSongs, setPlaybackSongs] = useState([]); // ⭐ ACTIVE CONTEXT (Album, Playlist, etc.)
    const [albums, setAlbums] = useState([]);

    const [isShuffle, setIsShuffle] = useState(false); // Lifted from MiddlePage
    const [queue, setQueue] = useState([]); // Lifted from MiddlePage
    const [showQueue, setShowQueue] = useState(false); // ⭐ NEW: Lifted for global sync
    const [isOnline, setIsOnline] = useState(navigator.onLine); // ⭐ NEW: Offline Detection

    const [searchQuery, setSearchQuery] = useState("");

    // Monitor Online/Offline Status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Fetch songs FROM BACKEND
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsRes, albumsRes] = await Promise.all([
                    api.get(`/api/songs/all`),
                    api.get(`/api/albums`)
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
                        audio: s.audioUrl,
                        album: s.album // Added album/movie info
                    }));



                    setAllSongs(formatted);
                    setPlaybackSongs(formatted); // Default to all songs
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

    // Next song logic with Queue and Shuffle
    const playNextSong = () => {
        if (!currentSong) return;

        // 1. Check Queue first
        if (queue.length > 0) {
            const nextSong = queue[0];
            setQueue(prev => prev.slice(1));
            setCurrentSong(nextSong);
            setIsPlaying(true);
            return;
        }

        // 2. Linear or Shuffle from playbackSongs
        if (playbackSongs.length === 0) return;

        let nextSong;
        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * playbackSongs.length);
            nextSong = playbackSongs[randomIndex];
        } else {
            const currentIndex = playbackSongs.findIndex((s) => s.id === currentSong.id);
            const nextIndex = (currentIndex + 1) % playbackSongs.length;
            nextSong = playbackSongs[nextIndex];
        }

        setCurrentSong(nextSong);
        setIsPlaying(true);
    };

    const playPreviousSong = () => {
        if (!currentSong || playbackSongs.length === 0) return;

        const currentIndex = playbackSongs.findIndex((s) => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + playbackSongs.length) % playbackSongs.length;
        setCurrentSong(playbackSongs[prevIndex]);
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
                allSongs={allSongs}
                setAllSongs={setAllSongs}
                playbackSongs={playbackSongs}
                setPlaybackSongs={setPlaybackSongs}
                albums={albums}
                active={activePage}
                setActive={handleNavigation}
                isShuffle={isShuffle}
                setIsShuffle={setIsShuffle}
                queue={queue}
                setQueue={setQueue}
                showQueue={showQueue}
                setShowQueue={setShowQueue}
                isOnline={isOnline} // ⭐ PASS DOWN
                playNextSong={playNextSong} // ⭐ PASS DOWN
                playPreviousSong={playPreviousSong} // ⭐ PASS DOWN
                progress={progress}
                currentTime={currentTime}
                duration={duration}
                audioRef={audioRef}
                searchQuery={searchQuery}
            />

            {/* Global Music Player Bar (Visible ONLY on Home) */}
            {currentSong && activePage === "Home" && (
                <MusicPlayer
                    currentSong={currentSong}
                    setCurrentSong={setCurrentSong}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    songs={playbackSongs}
                    playNextSong={playNextSong}
                    playPreviousSong={playPreviousSong}
                    progress={progress}
                    currentTime={currentTime}
                    duration={duration}
                    audioRef={audioRef}
                    isShuffle={isShuffle}
                    setIsShuffle={setIsShuffle}
                    queue={queue}
                    setQueue={setQueue}
                    showQueue={showQueue}
                    setShowQueue={setShowQueue}
                />
            )}

            {currentSong && (
                <audio ref={audioRef} src={currentSong.audio} onEnded={playNextSong} />
            )}
        </>
    );
};

export default Home;
