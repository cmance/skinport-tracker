import { calcProfit } from "./Scripts/helpers/pricing.js";
import { fetchHistory } from "./Scripts/helpers/skinportHistory.js";
import { cacheItem, readCacheItem } from "./Scripts/helpers/caching.js";
import { isCached } from "./Scripts/helpers/caching.js";
import { io } from "socket.io-client";
import parser from 'socket.io-msgpack-parser';

//console.log(readCacheItem('★ Huntsman Knife | Autotronic (Minimal Wear)')[0].last_7_days)

function shouldIgnoreFamily(family) { // This isnt working
  const ignoredFamilies = ['Fade', 'Case Hardened', 'Doppler', 'Gamma Doppler', 'Emerald', 'Sapphire', 'Ruby', 'Black Pearl'];
  return ignoredFamilies.some(ignored => family.includes(ignored));
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

// Listen to the Sale Feed
socket.on('saleFeed', async (result) => {
  var index = 0;
  for (var i = 0; i < result.sales.length; i++) {
    if (result.sales[i].saleStatus == 'sold') {
      index = i;
      // console.log(result.sales[i]);
      break;
    }
  }

  if (result.sales[index].saleStatus != 'sold' && result.sales[index].category == 'Knife' || shouldIgnoreFamily(result.sales[index].marketHashName)) { // If new and knife

    console.log("Item Found!: ", result.sales[index].marketHashName, " Sale Price: ", result.sales[index].salePrice/100, " Family: ", result.sales[index].family, " Category: ", result.sales[index].category, " URL: ", result.sales[index].url);
    // Check if the item is already in the cache
    if (!isCached(result.sales[index].marketHashName)) { // This works
      // If the item is not in the cache, fetch the history from the API
      // console.log("before fetch history")
      const data = await fetchHistory(result.sales[index].marketHashName);
      cacheItem(result.sales[index].marketHashName, data);
      
      // After its cached, check if the profit is met
      if (calcProfit(result.sales[index].salePrice/100, data[0].last_7_days.median, 0.12)) {
        // If the profit is met, do something
        console.log('Profit met! Item URL is: ', result.sales[index].url);
      }
    } else {
      // If the item is in the cache, read the history from the cache
      const history = readCacheItem(result.sales[index].marketHashName);
      // console.log("History:", history);

      if (history) {
        if (calcProfit(result.sales[index].salePrice/100, history[0].last_7_days.median, 0.12)) {
          // If the profit is met, do something
          console.log('Profit met! Item URL is: ', result.sales[index].url);
        } 
      } else {
        // History is invalidated, fetch it again
        console.log("Invalid cache entry.");
        // const data = await fetchHistory(result.sales[index].marketHashName);
        // replaceInvalidCacheEntry(result.sales[index].marketHashName, data);
      }
    }
  }
});

// Refactored code to use the new function
// socket.on('saleFeed', async (result) => {
//   const sale = result.sales.find(sale => sale.saleStatus !== 'sold' && sale.category === 'Knife');
//   if (!sale || shouldIgnoreFamily(sale.family)) {
//       return;
//   }

//   console.log("Item Found!: ", sale.marketHashName, " Sale Price: ", sale.salePrice / 100, " Family: ", sale.family, " Category: ", sale.category, " URL: ", sale.url);

//   const history = await getOrFetchHistory(sale.marketHashName);

//   if (history && calculateProfit(sale.salePrice / 100, history.last_7_days.median, 0.12)) {
//       console.log('Profit met! Item URL is: ', sale.url);
//   } else {
//       console.log('Profit not met!');
//   }
// });

// Join Sale Feed with paramters.
socket.emit('saleFeedJoin', { currency: 'USD', locale: 'en', appid: 730 })


/*
  STOPPING POINT NOTES
  1. Check if the item is being listed, and it is a knife. X
  2. Check if the item is a fade or case hardened, if so ignore. X + doppler
  3. Check to see if the item history is in the cache, if not fetch it and add it. X
  4. Store the history of the item to use for future calculations. X
  5. Check if desired profit margin can be met. Data is in cents so divide by 100 to get dollars. X

  Day 2
  1. Still need to implement the cache invalidation.
  2. Need to create Jest tests
  3. Need to do sale volume checking
  4. Need to add a price limit and floor
  5. Need to clean up the code, hard to read and can be optimized.
  
  const result = {
  eventType: 'saleFeed', // Event type
  sales: [
    {
      saleStatus: 'new', // Not 'sold', so it will pass the first condition
      category: 'Knife', // Matches the 'Knife' category condition
      family: 'Karambit', // Does not include 'Fade' or 'Case Hardened'
      marketHashName: '★ Karambit | Tiger Tooth (Factory New)', // Used for cache and API calls
      salePrice: 50000, // Sale price in cents
      url: 'karambit-tiger-tooth-factory-new', // URL for the item
    },
    {
      saleStatus: 'sold', // This item will be skipped
      category: 'Pistol',
      family: 'Glock-18',
      marketHashName: 'StatTrak™ Glock-18 | Water Elemental (Field-Tested)',
      salePrice: 2000,
      url: 'glock-18-water-elemental-field-tested',
    },
  ],
};


eventType: 'sold',
  sales: [
    {
      id: 0,
      saleId: 58575707,
      shortId: 'OTSLSI8E4D5',
      productId: 40216170,
      assetId: 446374731,
      itemId: 55046,
      appid: 730,
      steamid: '76561199562529614',
      url: 'bayonet-doppler-factory-new+phase-1',
      family: 'Doppler',
      family_localized: 'Doppler',
      name: 'Doppler (Phase 1)',
      title: 'Bayonet',
      text: 'Factory New ★ Covert Knife',
      marketName: '★ Bayonet | Doppler (Factory New)',
      marketHashName: '★ Bayonet | Doppler (Factory New)',
      color: '#8650AC',
      bgColor: null,
      image: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLu8JAllx8zJfAJG48ymmIWZqOf8MqjUx1Rd4cJ5nqfHpo720QfmqkQ4ZmjyLYOQdQNqZV-E-Va_lbvujZ-7vZTMnXcxviAg-z-DyENGQTnj',
      classid: '721208803',
      assetid: '42640602558',
      lock: null,
      version: 'Phase 1',
      versionType: 'phase',
      stackAble: false,
      suggestedPrice: 69918,
      salePrice: 67313,
      currency: 'EUR',
      saleStatus: 'sold',
      saleType: 'public',
      category: 'Knife',
      category_localized: 'Knife',
      subCategory: 'Bayonet',
      subCategory_localized: 'Bayonet',
      pattern: 837,
      finish: 418,
      customName: null,
      wear: 0.021281395107507706,
      link: 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561199562529614A42640602558D7937069648988291332',
      type: '★ Covert Knife',
      exterior: 'Factory New',
      quality: '★',
      rarity: 'Covert',
      rarity_localized: 'Covert',
      rarityColor: '#eb4b4b',
      collection: null,
      collection_localized: null,
      stickers: [],
      charms: [],
      canHaveScreenshots: true,
      screenshots: [Array],
      souvenir: false,
      stattrak: false,
      tags: [Array],
      ownItem: false
    }
      */