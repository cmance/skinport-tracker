import dotenv from 'dotenv';
import fetch from "node-fetch";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID
const API_KEY = process.env.CLIENT_SECRET

const HISTORY_URL = "https://api.skinport.com/v1/sales/history"

export async function fetchHistory(item) {
    console.log('Fetching history for:', item);

    // Encode API key and client ID
    const encodedData = Buffer.from(`${CLIENT_ID}:${API_KEY}`).toString('base64');
    const headers = {
        "Authorization": `Basic ${encodedData}`,
        "Accept-Encoding": "br" // Adding Brotli compression support
    };

    const params = new URLSearchParams({
        "market_hash_name": item,
        "currency": "USD"
    });

    try {
        const response = await fetch(`${HISTORY_URL}?${params.toString()}`, { headers });
        // console.log(`Response status code: ${response.status}`);

        if (response.status === 429) {
            console.log("Rate limited. Retrying after 65 seconds...");
            await new Promise(resolve => setTimeout(resolve, 65000)); // Wait for 5 seconds
            return fetchHistory(item); // Retry the request
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error fetching history:", error);
        return null;
    }
}