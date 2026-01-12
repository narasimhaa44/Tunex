const axios = require('axios');

async function simulateArtistProfile() {
    try {
        console.log("Fetching Data...");
        const [songsRes, albumsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/songs/all'),
            axios.get('http://localhost:5000/api/albums')
        ]);

        const songs = songsRes.data;
        const albums = albumsRes.data.albums || albumsRes.data;

        console.log(`Loaded ${songs.length} songs and ${albums.length} albums.`);

        // Mock Artist
        const artist = { name: "Anirudh Ravichandran" };
        console.log(`\n--- Simulating Profile for: "${artist.name}" ---`);

        // --- LOGIC FROM FRONTEND ---
        
        // 1. Normalize Helper
        const normalize = (str) => str ? str.toLowerCase() : '';
        const searchName = normalize(artist.name.split(' ')[0]); // "anirudh"
        const matches = (text) => normalize(text).includes(searchName);

        console.log(`Search Term: "${searchName}"`);

        // 2. Filter Albums
        const artistAlbums = albums.filter(album => 
            matches(album.artist) || matches(album.description)
        );
        console.log(`Found ${artistAlbums.length} matching albums:`);
        artistAlbums.forEach(a => console.log(`  - ${a.title} (Artist: ${a.artist}, Desc: ${a.description})`));

        // 3. Reverse Lookup IDs
        const artistAlbumSongIds = new Set();
        artistAlbums.forEach(album => {
            if (album.songs && Array.isArray(album.songs)) {
                album.songs.forEach(songId => {
                    const id = typeof songId === 'object' ? songId._id : songId;
                    artistAlbumSongIds.add(String(id));
                });
            }
        });
        console.log(`Collected ${artistAlbumSongIds.size} song IDs from these albums.`);

        // 4. Filter Songs
        const artistSongs = songs.filter(song => {
            // Direct Match
            if (matches(song.artist)) return true;
            if (song.artists && song.artists.some(a => matches(a))) return true;

            // Reverse Lookup
            if (artistAlbumSongIds.has(String(song._id))) return true;
            if (artistAlbumSongIds.has(String(song.id))) return true;

            // Forward Lookup
            let albumObj = null;
            if (song.album) {
                if (typeof song.album === 'object' && (song.album.description || song.album.artist)) {
                    albumObj = song.album;
                } else {
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

        console.log(`\n--- Final Result ---`);
        console.log(`Found ${artistSongs.length} songs for profile.`);
        artistSongs.forEach(s => console.log(`  - ${s.title} (Reason: Artist=${s.artist}, Album=${s.album ? 'Yes' : 'Null'})`));

    } catch (err) {
        console.error("Error:", err.message);
    }
}

simulateArtistProfile();
