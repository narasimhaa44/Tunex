const axios = require('axios');

async function testRoutes() {
    try {
        console.log("Testing GET /api/albums...");
        const res = await axios.get('http://localhost:5000/api/albums');
        console.log("GET /api/albums status:", res.status);
    } catch (err) {
        console.log("GET /api/albums failed:", err.message, err.response?.status);
    }

    try {
        console.log("Testing POST /api/albums (without data, expecting 400 or 500, but not 404)...");
        const res = await axios.post('http://localhost:5000/api/albums', {});
        console.log("POST /api/albums status:", res.status);
    } catch (err) {
        console.log("POST /api/albums failed:", err.message, err.response?.status);
    }
}

testRoutes();
