import { calcProfit } from "./Scripts/helpers/pricing.js";
import { fetchHistory } from "./Scripts/helpers/skinportHistory.js";
import { cacheItem, readCacheItem } from "./Scripts/helpers/caching.js";
import { sendDiscordNotification } from "./Scripts/helpers/webhook.js";
import { isCached } from "./Scripts/helpers/caching.js";
import { io } from "socket.io-client";
import parser from 'socket.io-msgpack-parser';

function shouldIgnoreFamily(family) {
  const ignoredFamilies = ['Fade', 'Case Hardened', 'Doppler', 'Gamma Doppler', 'Emerald', 'Sapphire', 'Ruby', 'Black Pearl'];

  // Ensure `family` is a string
  if (typeof family !== 'string') {
    console.log("Invalid family value:", family);
    return false;
  }

  // Check if the family matches any ignored families
  const isIgnored = ignoredFamilies.some(ignored => family.toLowerCase().includes(ignored.toLowerCase()));

  if (isIgnored) {
    console.log(`Ignoring family: ${family}`);
  }

  return isIgnored;
}

// Helper function to get or fetch item history
async function getOrFetchHistory(marketHashName) {
  if (isCached(marketHashName)) {
    return readCacheItem(marketHashName);
  }

  const data = await fetchHistory(marketHashName);
  cacheItem(marketHashName, data);
  return data;
}

const socket = io('wss://skinport.com', {
  transports: ['websocket'],
  parser,
});

const testData = {
  eventType: 'saleFeed', // Event type
  sales: [
    {
      saleId: 59314859,
      saleStatus: 'listed', // Not 'sold', so it will pass the first condition
      category: 'Knife', // Matches the 'Knife' category condition
      family: 'Karambit', // Does not include 'Fade' or 'Case Hardened'
      marketHashName: '★ Karambit | Tiger Tooth (Factory New)', // Used for cache and API calls
      salePrice: 50000, // Sale price in cents
      url: 'karambit-tiger-tooth-factory-new' // URL for the item
    },
    {
      saleStatus: 'listed', // This item will be skipped
      category: 'Pistol',
      family: 'Glock-18',
      marketHashName: 'StatTrak™ Glock-18 | Water Elemental (Field-Tested)',
      salePrice: 2000,
      url: 'glock-18-water-elemental-field-tested'
    }
  ]
}


// Listen to the Sale Feed
socket.on('saleFeed', async (result) => {
  // result = testData; // For testing purposes, replace with actual data

  if (!result.sales) {
    console.log("Invalid sales data:", result);
    return;
  }

  // Find the first valid sale
  const currentItem = result.sales.find((sale) => {
    if (!sale) return false; // Ignore null or undefined sales
    if (sale.saleStatus !== 'listed') return false; // Ignore sold items
    if (sale.category !== 'Knife') return false; // Ignore non-knife items
    if (shouldIgnoreFamily(sale.family)) return false; // Ignore specific families
    if (sale.salePrice / 100 >= 600) return false; // Ignore price over $600
    return true; // This sale is valid
  });

  // Validate currentItem before accessing its properties
  if (!currentItem) {
    // console.log("No valid items found.");
    return;
  }

  console.log("Item Found!: ", currentItem.marketHashName, " Sale Price: ", currentItem.salePrice / 100, " Family: ", currentItem.family, " Category: ", currentItem.category, " URL: ", currentItem.url);

  const historyArray = await getOrFetchHistory(currentItem.marketHashName);
  const history = historyArray[0];

  if (history.last_7_days.volume <= 1) {
    console.log("Volume is too low: ", history.last_7_days.volume);
    return;
  }

  if (history && calcProfit(currentItem.salePrice / 100, history.last_7_days.median, 0.08)) {
    console.log(`${history.item_page}/${currentItem.saleId}`);
    const url = `${history.item_page}/${currentItem.saleId}`;
    currentItem.url = url; // Add the URL to the current item
    sendDiscordNotification(currentItem);
  }
});

// Join Sale Feed with paramters.
socket.emit('saleFeedJoin', { currency: 'USD', locale: 'en', appid: 730 })


/*
  STOPPING POINT NOTES
  1. Check if the item is being listed, and it is a knife. X
  2. Check if the item is a family that is hard to find pricing data on (ex. Fade, Doppler), if so ignore. X
  3. Check to see if the item history is in the cache, if not fetch it and add it. X
  4. Store the history of the item to use for future calculations. X
  5. Check if desired profit margin can be met. Data is in cents so divide by 100 to get dollars. X

  Day 2
  1. Still need to implement the cache invalidation.
  2. Need to create Jest tests X
  3. Need to do sale volume checking X
  4. Need to add a price limit X
  5. Need to clean up the code, hard to read and can be optimized. X

  Day 3
  1. Add extensive testing in Jest for each method and tests for index.js with test data
  2. Add to EC2 and run 24/7
  3. Link the EC2 instance to a Discord bot to send messages when a profitable item is found.
  4. Add a clean up cache method to remove old cache entries.

  Day 4
  1. Cache invalidation
  2. EC2 instance setup
  3. Jest testing

  LONG TERM
  1. Create a way to automate the buying of the item when confidence is build with the app.
*/