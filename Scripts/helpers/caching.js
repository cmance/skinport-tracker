import fs from "fs";
import path from "path";

// const CACHE_PATH = path.join(__dirname, "Cache", "item_cache.json");

// Cache the item
export function cacheItem(item, data) {
    const cache = readCache();
    cache[item] = {
        data,
        datetimeCached: Date.now()
    }
    saveCache(cache);
}

// Read the cache
export function readCache() {
    if (fs.existsSync(CACHE_PATH)) {
        if (fs.statSync(CACHE_PATH).size === 0) {
            return {}; // Return an empty object if the file is empty
        }
        try {
            const fileData = fs.readFileSync(CACHE_PATH, 'utf-8');
            return JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading cache:", error);
            return {}; // Return an empty object if JSON is invalid
        }
    }
    return {};
}

// export function readCacheItem(item) {
//     const cache = readCache();
//     const entry = cache[item];

//     if (!entry) {
//         throw new Error(`Cache entry for ${item} not found. Method: readCacheItem.`);
//     }

//     const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
//     const isExpired = Date.now() - entry.timestamp > oneWeekInMs;

//     if (isExpired) {
//         console.log(`Cache entry for ${item} is expired.`);
//         return false; // Treat as not cached if expired
//     }

//     return entry.data; // Return the cached data if not expired
// }

// export function replaceInvalidCacheEntry(item, data) {
//     const cache = readCache();
//     delete cache[item];
//     cacheItem(item, data);
//     saveCache(cache);
// }

// Save the cache
function saveCache(cache) {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

// Check if the item is in the cache
export function isCached(item) {
    const cache = readCache();
    return cache.hasOwnProperty(item);
}