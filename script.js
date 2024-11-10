// // Your Vercel Proxy URL
const url = "/api/proxy"; // This calls the serverless function
const { getApiKey } = require("./api/proxy.js");

console.log(getApiKey());
window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${url}?query=${query}`); // Call your Vercel serverless function
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = ""; // Clear previous articles

  articles.forEach((article) => {
    if (!article.urlToImage) return; // Skip if no image
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} . ${date}`;

  // Open article link when clicked
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let currentSelectedNavItem = null;

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNavItem?.classList.remove("active");
  currentSelectedNavItem = navItem;
  currentSelectedNavItem.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  currentSelectedNavItem?.classList.remove("active");
  currentSelectedNavItem = null;
});
