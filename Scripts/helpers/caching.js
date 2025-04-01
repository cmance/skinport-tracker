import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_PATH = path.join(__dirname, "Cache", "item_cache.json");

// Cache the item
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

export function readCacheItem(item) {
    console.log(`Reading cache item: ${item}`);
    const cache = readCache();
    return cache[item]; // Return the cached data if not expired
}

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

    if (!cache[item]) {
        console.log(`Cache miss for item: ${item}`);
        return false; // Item is not cached
    }

    // Check if the cache entry is expired
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const isExpired = Date.now() - cache[item].datetimeCached > oneWeekInMs;

    if (isExpired) {
        console.log(`Cache expired for item: ${item}`);
        delete cache[item]; // Remove expired cache entry
        saveCache(cache); // Save the updated cache
        return false; // Cache is expired
    }

    return true; // Item is cached and not expired
}