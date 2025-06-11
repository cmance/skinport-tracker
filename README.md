# SkinportScraper

**SkinportScraper** is an automated Node.js tool for monitoring the Skinport marketplace in real-time, identifying profitable CS2 knife deals, and optionally sending Discord notifications for good finds. It leverages Skinport's live sale feed and historical pricing data to help you spot undervalued items instantly.

---

## Features

- **Real-Time Monitoring:** Connects to Skinport's live sale feed via WebSocket.
- **Smart Filtering:** Only considers knives, ignores overpriced or unwanted families (e.g., Doppler, Fade).
- **Profit Calculation:** Compares live sale prices to historical medians, factoring in marketplace fees and your desired profit margin.
- **Caching:** Caches item history for 7 days to minimize API calls and speed up decision-making.
- **Discord Alerts:** (Optional) Instantly notifies you on Discord when a profitable deal is found.
- **Configurable:** Easily adjust profit thresholds, ignored families, and notification settings.

---

## Setup

### 1. Clone & Install

```sh
git clone https://github.com/yourusername/SkinportScraper.git
cd SkinportScraper
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory with your Skinport API credentials:

```
CLIENT_ID=your_skinport_client_id
CLIENT_SECRET=your_skinport_api_key
DISCORD_WEBHOOK=your_discord_webhook_url # Optional, for notifications on Discord
```

### 3. (Optional) Enable Discord Notifications

- All you need to do is set your Discord webhook URL in the `.env` file. The scraper will send notifications for profitable deals automatically.

---

## Usage

Start the scraper with:

```sh
node index.js
```

You’ll see real-time logs of found items, profit calculations, and (if enabled) Discord notifications for good deals.

---

## How It Works

1. **Connects to Skinport:** Listens for new knife listings in real-time.
2. **Filters Listings:** Ignores unwanted families (e.g., Doppler, Fade) and overpriced items.
3. **Fetches History:** Uses cached data or fetches fresh price history from Skinport’s API. Complete with a 7-day cache to reduce API calls.
4. **Calculates Profit:** Determines if the deal meets your profit margin (default: 8%).
5. **Alerts:** Logs the deal and optionally sends a Discord notification.

---

## Customization

- **Profit Margin:** Change the `desiredPercentProfit` in `index.js/calcProfit` (default is `0.08` for 8%).
- **Ignored Families:** Edit the `ignoredFamilies` array in `Scripts/helpers/general.js`.
- **Price Cap:** Adjust the price filter in `index.js` (`sale.salePrice / 100 >= 600`).

---

## Project Structure

```
SkinportScraper/
├── index.js                   # Main entry point
├── Scripts/
│   └── helpers/
│       ├── pricing.js         # Profit calculation logic
│       ├── skinportHistory.js # History fetching & caching
│       ├── caching.js         # Cache management
│       ├── general.js         # Filtering helpers
│       └── webhook.js         # Discord notification logic
├── Cache/
│   └── item_cache.json        # Cached item histories
├── .env                       # Your API credentials
└── README.md                  # This file
```

---

## Disclaimer

- This tool is for educational purposes. Use responsibly and in accordance with Skinport’s terms of service.
- No automated purchasing is performed—this tool only notifies you of deals. It is against Skinport's terms to use bots for automated buying.
- Always double-check prices before making purchases.
- The author is not responsible for any losses incurred while using this tool.
- Ensure you comply with all local laws and regulations regarding online trading.

---

## Contributing

Pull requests and suggestions are welcome! Please open an issue or PR for improvements.

---
