import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_PATH = path.join(__dirname, "Cache", "item_cache.json");

/**
 * Caches an item with the key being the item name and the value being the data.
 * The data is stored with a timestamp to check for expiration later.
 * @param {String} item KEY
 * @param {Object} data VALUE
 */
export function cacheItem(item, data) {
    console.log(`Caching item: ${item}`);
    const cache = readCache();
    cache[item] = {
        data,
        datetimeCached: Date.now()
    }
    // cache[item] = data; // Store the data directly without timestamp
    saveCache(cache);
}

/**
 * Reads the cache file and returns the cached data as an object.
 * @returns {Object} - The cached data as an object.
 */
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

/**
 * Reads a specific item from the cache and checks if it is expired.
 * @param {String} item 
 * @returns {Object}
 */
export function readCacheItem(item) {
    console.log(`Reading cache item: ${item}`);
    const cache = readCache();

    if (!cache[item]) {
        console.log(`Cache miss for item: ${item}`);
        return null; // Return null if the item is not cached
    }

    // Check if the cache entry is expired
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const isExpired = Date.now() - cache[item].datetimeCached > oneWeekInMs;

    if (isExpired) {
        console.log(`Cache expired for item: ${item}`);
        delete cache[item]; // Remove expired cache entry
        saveCache(cache); // Save the updated cache
        return null; // Return null for expired items
    }

    return cache[item].data; // Return the cached data if not expired
}

/**
 * Saves the cache object to the cache file.
 * @param {Object} cache 
 */
function saveCache(cache) {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

/**
 * Checks if an item is cached and not expired.
 * @param {String} item 
 * @returns {Boolean}
 */
export function isCached(item) {
    const cachedItem = readCacheItem(item);
    return cachedItem !== null; // Return true if the item is valid and not expired
}