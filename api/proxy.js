import fetch from "node-fetch";
import axios from "axios";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Environment variables
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Handle POST request for visitor notification
  if (req.method === "POST" && req.url.includes("/api/notify-visit")) {
    try {
      const visitorData = req.body;

      // Format the timestamp
      const visitTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      });

      // Create formatted message
      const message = `🚀 New Visitor:
      - **IP Address**: ${ip}
      - **Location**: ${city}, ${region}, ${country}
      - **User Agent**: ${userAgent}
      - **Lat Long**: ${loc}
      - **Visit Time**: ${visitTime}`;

      // Send to Telegram
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Visitor notification sent successfully",
      });
    } catch (error) {
      console.error("Notification Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send visitor notification",
        error: error.message,
      });
    }
  }

  // Handle GET request for news
  if (req.method === "GET") {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const url = `https://newsapi.org/v2/everything?q=${query}&apikey=${NEWS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      return res.status(500).json({ error: "Failed to fetch news" });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: "Method not allowed" });
}
