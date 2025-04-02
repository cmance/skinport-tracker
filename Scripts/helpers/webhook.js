import fetch from 'node-fetch';

/**
 * Sends a notification to Discord using a webhook URL.
 * @param {String} item 
 */
export async function sendDiscordNotification(item) {
  const webhookUrl = 'https://discord.com/api/webhooks/1355709529450348724/RKULzb2X7dQZiAN1sNPWuKH7RKrfnUqMe7UTRFmJwI0IVNeYXjZ640JJoRLf9J56xrh4'; // Replace with your webhook URL

  const payload = {
    content: `=======================================\n**Good Deal Found!**\n**Item:** ${item.marketHashName}\n**Price:** $${item.salePrice / 100}\n**URL:** ${item.url}\n=======================================`,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Discord notification sent successfully!');
    } else {
      console.error('Failed to send Discord notification:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}