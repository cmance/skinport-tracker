import { calculateProfit } from "./Scripts/helpers/pricing.js";
import { fetchHistory } from "./Scripts/helpers/skinportHistory.js";
import { cacheItem, replaceInvalidCacheEntry, isCached, readCacheItem } from "./Scripts/helpers/caching.js";
import { io } from "socket.io-client";
import parser from 'socket.io-msgpack-parser';


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
      break;
    }
  }

  if (result.eventType == 'listed') {
    console.log(result.sales[index]);
  }

```
  STOPPING POINT NOTES
  1. Check if the item is being listed, and it is a knife.
  2. Check if the item is a fade or case hardened, if so ignore.
  3. Check to see if the item history is in the cache, if not fetch it and add it.
  4. Store the history of the item to use for future calculations.
  5. Check if desired profit margin can be met. Data is in cents so divide by 100 to get dollars.
```

  // NEED TO IMPLEMENT CACHE INVALIDATION
  // 1. Add date timestamp to cache when storing, check if it is older than 7 days.
  // add to the existing object when retrieving cache.
  // 2. If the cache is older than 7 days, fetch the history again and replace the cache entry.

  // Filter for new listed knives.
  // if (result.data.eventType === 'listed' && result.data.category === 'Knife') { // If new and knife
  //   console.log(result.data);

  //   if (result.data.family.includes('Fade') || result.data.family.includes('Case Hardened')) { // If Fade or case hardened, ignore
  //     return;
  //   }
  //   // Check if the item is already in the cache
  //   if (!isCached(result.data.marketHashName)) {
  //     // If the item is not in the cache, fetch the history from the API
  //     fetchHistory(result.data.marketHashName).then((data) => {
  //       cacheItem(result.data.marketHashName, data);
  //     });
  //   } else {
  //     // If the item is in the cache, read the history from the cache
  //     const history = readCacheItem(result.data.marketHashName);

  //     if (history) {
  //       if (calculateProfit(itemPrice, history.median7day, 0.2)) {
  //         // If the profit is met, do something
  //         console.log('Profit met! Item URL is: ', itemURL);
  //       } else {
  //         // If the profit is not met, do something
  //         console.log('Profit not met! :(');
  //       }
  //     } else {
  //       // History is invalidated, fetch it again
  //       const data = await fetchHistory(result.data.marketHashName);
  //       replaceInvalidCacheEntry(result.data.marketHashName, data);
  //     }
  //   }
  // }
});

// Join Sale Feed with paramters.
socket.emit('saleFeedJoin', { currency: 'USD', locale: 'en', appid: 730 })

/*
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