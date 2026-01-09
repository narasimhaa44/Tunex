/**
 * Utility for managing offline assets using the Cache API.
 * This allows audio files and cover images to be stored locally for offline playback.
 */

const CACHE_NAME = 'tunex-offline-assets';

/**
 * Caches a song's audio and cover image.
 * @param {Object} song - The song object containing audioUrl and coverUrl (or audio/cover).
 */
export const cacheSongAssets = async (song) => {
    if (!('caches' in window)) return;

    const audioUrl = song.audio || song.audioUrl;
    const coverUrl = song.cover || song.coverUrl;

    if (!audioUrl || !coverUrl) return;

    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache audio and cover
        await Promise.all([
            cache.add(audioUrl),
            cache.add(coverUrl)
        ]);
        
        console.log(`Successfully cached assets for: ${song.title}`);
        return true;
    } catch (error) {
        console.error(`Failed to cache assets for ${song.title}:`, error);
        return false;
    }
};

/**
 * Checks if a song's assets are already cached.
 * @param {Object} song 
 * @returns {Boolean}
 */
export const isSongCached = async (song) => {
    if (!('caches' in window)) return false;

    const audioUrl = song.audio || song.audioUrl;
    const coverUrl = song.cover || song.coverUrl;

    if (!audioUrl || !coverUrl) return false;

    try {
        const cache = await caches.open(CACHE_NAME);
        const [audioMatch, coverMatch] = await Promise.all([
            cache.match(audioUrl),
            cache.match(coverUrl)
        ]);
        
        return !!(audioMatch && coverMatch);
    } catch (error) {
        console.error("Error checking cache status:", error);
        return false;
    }
};

/**
 * Removes a song's assets from the cache.
 * @param {Object} song 
 */
export const uncacheSongAssets = async (song) => {
    if (!('caches' in window)) return;

    const audioUrl = song.audio || song.audioUrl;
    const coverUrl = song.cover || song.coverUrl;

    try {
        const cache = await caches.open(CACHE_NAME);
        await Promise.all([
            cache.delete(audioUrl),
            cache.delete(coverUrl)
        ]);
        return true;
    } catch (error) {
        console.error("Error uncaching song:", error);
        return false;
    }
};

/**
 * Clears the entire offline asset cache.
 */
export const clearOfflineCache = async () => {
    if (!('caches' in window)) return;
    return caches.delete(CACHE_NAME);
};
