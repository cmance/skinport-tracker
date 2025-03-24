import aiohttp
import os
import base64
import time
from dotenv import load_dotenv
import asyncio
import json

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
API_KEY = os.getenv("CLIENT_SECRET")

HISTORY_URL = "https://api.skinport.com/v1/sales/history"

CACHE_PATH = "Cache\item_cache.json"

async def fetch_history(item):
    
    print('Fetching history for:', item)

    # Encode API key and client id
    encodedData = base64.b64encode(f"{CLIENT_ID}:{API_KEY}".encode()).decode()
    authHeaderString = {
        "Authorization": f"Basic {encodedData}",
        "Accept-Encoding": "br",  # Adding Brotli compression support
    }

    print(f"Authorization header: {authHeaderString}")
    
    params = {
        "market_hash_name": item,
        "currency": "USD"
    }
    
    # Using aiohttp for async HTTP request
    async with aiohttp.ClientSession() as session:
        async with session.get(HISTORY_URL, headers=authHeaderString, params=params) as response:
            print(f"Response status code: {response.status}")
            if response.status == 429:
                print("Rate limited")
                time.sleep(5)
            response_data = await response.json()
            return response_data

def cache_item():
    # Cache the item
    read_cache()
    cache[item] = data
    # TODO: Save the cache to a file

def read_cache():
    # Read the cache file if it exists
    if os.path.exists(CACHE_PATH):
       with open(CACHE_PATH, 'r') as f:
           return json.load(f)

def save_cache():
    # Save the current state of the cache
    pass


def main():
    item = "AK-47 | Redline (Field-Tested)"
    history = asyncio.run(fetch_history(item))
    # read_cache()
    print(history) 
    
if __name__ == "__main__":
    main()
    # Rate limit is 5 requests per minute
    
    # Cache, plus a date, read the date and if expired, fetch new data (1 week?) 
    
'''
EXAMPLE RESPONSE:

[
    {'market_hash_name': 'AK-47 | Redline (Field-Tested)', 
    'version': None, 
    'currency': 'USD', 
    'item_page': 'https://skinport.com/item/ak-47-redline-field-tested', 
    'market_page': 'https://skinport.com/market?item=Redline&cat=Rifle&type=AK-47', 
    'last_24_hours': 
        {'min': 36.51, 
        'max': 214.9, 
        'avg': 62.67, 
        'median': 42.2, 
        'volume': 18}, 
    'last_7_days': 
        {'min': 33.41, 
        'max': 214.9, 
        'avg': 47.11, 
        'median': 41.89, 
        'volume': 140}, 
    'last_30_days': 
        {'min': 20.48, 
        'max': 884.17, 
        'avg': 50.71, 
        'median': 39.53, 
        'volume': 724}, 
    'last_90_days': 
        {'min': 17.78, 
        'max': 2370.08, 
        'avg': 48.15, 
        'median': 34.86, 
        'volume': 2093}
    }
]
'''