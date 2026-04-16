const axios = require('axios');
const NodeCache = require('node-cache');

const tokenCache = new NodeCache();

async function getSpotifyToken() {
    const cachedToken = tokenCache.get('spotify_token');
    if (cachedToken) {
        return cachedToken;
    }

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
            grant_type: 'client_credentials'
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')
            }
        }
    );

    const token = response.data.access_token;
    console.log(token);
    const expiresIn = response.data.expires_in;

    tokenCache.set('spotify_token', token, expiresIn - 60);

    console.log("Spotify token refreshed");
    return token;
}

module.exports = { getSpotifyToken };
