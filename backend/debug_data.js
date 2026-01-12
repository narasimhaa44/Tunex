const axios = require('axios');

async function inspectData() {
    try {
        console.log("Fetching Albums...");
        const res = await axios.get('http://localhost:5000/api/albums');
        const albums = res.data.albums || res.data;
        
        console.log(`Found ${albums.length} albums.`);
        
        const anirudhAlbums = albums.filter(a => 
            (a.artist && a.artist.toLowerCase().includes('anirudh')) ||
            (a.description && a.description.toLowerCase().includes('anirudh'))
        );

        console.log("\n--- Anirudh Albums ---");
        anirudhAlbums.forEach(a => {
            console.log(`ID: ${a._id}`);
            console.log(`Title: ${a.title}`);
            console.log(`Description: "${a.description}"`);
            console.log(`Artist: "${a.artist}"`);
            console.log("-----------------------");
        });

    } catch (err) {
        console.error("Error fetching data:", err.message);
    }
}

inspectData();
