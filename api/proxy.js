import fetch from "node-fetch";

export default async function handler(req, res) {
  const { query } = req.query; // Get the query from the request

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }
  const API_KEY = process.env.NEWS_API_KEY; // Your NewsAPI key
  console.log(API_KEY, "lllllllllll");
  const url = `https://newsapi.org/v2/everything?q=${query}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url); // Make the request to NewsAPI
    const data = await response.json();

    // Return the data as JSON to the client
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

// // server.js
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json()); // To handle JSON data

// // Environment variables for sensitive information
// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// const NEWS_API_KEY = process.env.NEWS_API_KEY;

// // Endpoint for visitor notifications
// app.post("/api/notify-visit", async (req, res) => {
//   try {
//     const visitorData = req.body;
//     const { ip, city, region, country, userAgent, visitTime, loc } =
//       visitorData;

//     // Construct the message to send to Telegram
//     const message = `🚀 New Visitor:
// - **IP Address**: ${ip}
// - **Location**: ${city}, ${region}, ${country}
// - **Lat Long**: ${loc}
// - **User Agent**: ${userAgent}
// - **Visit Time**: ${visitTime}`;

//     // Send the notification to Telegram
//     await axios.post(
//       `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//       {
//         chat_id: TELEGRAM_CHAT_ID,
//         text: message,
//         parse_mode: "Markdown",
//       }
//     );

//     res.status(200).json({ success: true, message: "Notification sent" });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to send notification" });
//   }
// });

// // Endpoint to fetch news data from the News API
// app.get("/api/get-news", async (req, res) => {
//   const query = req.query.q || "India"; // Default to "India" if no query provided

//   try {
//     const response = await axios.get(
//       `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`
//     );
//     res.json(response.data); // Send the data back to the frontend
//   } catch (error) {
//     console.error("Error fetching news:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch news" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
