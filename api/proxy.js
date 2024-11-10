import fetch from "node-fetch";

export default async function handler(req, res) {
  const { query } = req.query; // Get the query from the request

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }
  const API_KEY = process.env.NEWS_API_KEY; // Your NewsAPI key
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
