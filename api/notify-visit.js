// notify-visit.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ip, city, region, country, userAgent, visitTime, loc } = req.body;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Bot token from environment
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Chat ID from environment

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: "Telegram configuration missing" });
  }

  // Construct the message for Telegram
  const message = `🚀 New Visitor:
- **IP Address**: ${ip}
- **Location**: ${city}, ${region}, ${country}
- **Lat Long**: ${loc}
- **User Agent**: ${userAgent}
- **Visit Time**: ${visitTime}`;

  try {
    // Send the message to Telegram
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );
    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error sending notification to Telegram:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
}
