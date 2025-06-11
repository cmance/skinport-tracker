import { calcProfit } from "./Scripts/helpers/pricing.js";
import { getOrFetchHistory } from "./Scripts/helpers/skinportHistory.js";
import { sendDiscordNotification } from "./Scripts/helpers/webhook.js";
import { shouldIgnoreFamily } from "./Scripts/helpers/general.js";
import { io } from "socket.io-client";
import parser from 'socket.io-msgpack-parser';

const socket = io('wss://skinport.com', {
  transports: ['websocket'],
  parser,
});

socket.on('saleFeed', async (result) => {

  if (!result.sales) {
    console.log("Invalid sales data:", result);
    return;
  }

  const currentItem = result.sales.find((sale) => {
    if (!sale) return false; // Ignore null or undefined sales
    if (sale.saleStatus !== 'listed') return false; // Ignore sold items
    if (sale.category !== 'Knife') return false; // Ignore non-knife items
    if (shouldIgnoreFamily(sale.family)) return false; // Ignore specific families
    if (sale.salePrice / 100 >= 600) return false; // Ignore price over $600
    return true; // This sale is valid
  });

  if (!currentItem) {
    return;
  }

  console.log("Item Found!: ", currentItem.marketHashName, " Sale Price: ", currentItem.salePrice / 100, " Family: ", currentItem.family, " Category: ", currentItem.category, " URL: ", currentItem.url);

  const historyArray = await getOrFetchHistory(currentItem.marketHashName);
  
  if (!historyArray || historyArray.length === 0) {
    console.log("No history found for item: ", currentItem.marketHashName);
    return;
  }

  const history = historyArray[0];

  if (!history || !history.last_7_days || history.last_7_days.volume <= 1) {
    console.log("Invalid or insufficient history data for item: ", currentItem.marketHashName);
    return; // Exit early if history is invalid or volume is too low
  }

  if (history && calcProfit(currentItem.salePrice / 100, history.last_7_days.median, 0.08)) { // Change 0.08 to your desired profit margin
    const url = `${history.item_page}/${currentItem.saleId}`;
    console.log(url);
    currentItem.url = url;
    if (process.env.DISCORD_WEBHOOK) {
      sendDiscordNotification(currentItem);
    }
  }
});

// Join Sale Feed with paramters.
socket.emit('saleFeedJoin', { currency: 'USD', locale: 'en', appid: 730 })