// // Your Vercel Proxy URL
const url = "/api/proxy"; // This calls the serverless function
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

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
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

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

function closeMenu() {
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.querySelector(".hamburger");
  if (navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    hamburger.innerHTML = "☰";
  }
}

let currentSelectedNavItem = null;

function onNavItemClick(id) {
  closeMenu();
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNavItem?.classList.remove("active");
  currentSelectedNavItem = navItem;
  currentSelectedNavItem.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// Modified search button handler
searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  closeMenu();
  fetchNews(query);
  currentSelectedNavItem?.classList.remove("active");
  currentSelectedNavItem = null;
  searchText.value = "";
});

// Modified Enter key handler
searchText.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const query = searchText.value;
    if (!query) return;
    closeMenu();
    fetchNews(query);
    currentSelectedNavItem?.classList.remove("active");
    currentSelectedNavItem = null;
  }
});

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.querySelector(".hamburger");

  if (navLinks.classList.contains("active")) {
    closeMenu();
  } else {
    navLinks.classList.add("active");
    hamburger.innerHTML = "✕";
  }
}

// Modified click outside handler
document.addEventListener("click", function (event) {
  const navLinks = document.getElementById("nav-links");

  // Don't close if clicking search input, search button, or hamburger
  if (
    event.target.classList.contains("news-input") ||
    event.target.classList.contains("search-button") ||
    event.target.classList.contains("hamburger") ||
    event.target.closest(".search-bar")
  ) {
    return;
  }

  // Only close for nav items or clicks outside
  if (
    (event.target.classList.contains("nav-items") ||
      (!event.target.closest(".nav-links") &&
        !event.target.closest(".hamburger"))) &&
    navLinks.classList.contains("active")
  ) {
    closeMenu();
  }
});

// Handle clicks within the nav-links area
document
  .querySelector(".nav-links")
  .addEventListener("click", function (event) {
    // Only close for nav items, not for search input or search area
    if (event.target.classList.contains("nav-items")) {
      closeMenu();
    }

    // Prevent the click from bubbling up if it's in the search area
    if (event.target.closest(".search-bar")) {
      event.stopPropagation();
    }
  });

// Handle clicks within the nav-links area
document
  .querySelector(".nav-links")
  .addEventListener("click", function (event) {
    // If clicking on a nav item or search button, menu will close automatically
    if (
      event.target.classList.contains("nav-items") ||
      event.target.classList.contains("search-button")
    ) {
      closeMenu();
    }
  });

//Todo: Function to fetch visitor details and send to server
async function notifyVisit() {
  try {
    // Collect basic visitor information
    const response = await fetch("https://ipinfo.io/json?token=b5a0bdf7ac75e0"); // Use IPInfo or another IP API for location data
    const data = await response.json();

    // Prepare data to send
    const visitorData = {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      userAgent: navigator.userAgent,
      visitTime: new Date().toLocaleString(),
    };

    // Send data to your server
    await fetch("http://localhost:3000/api/notify-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorData),
    });
  } catch (error) {
    console.error("Failed to notify visit:", error);
  }
}

// Trigger notifyVisit function when page loads
// window.addEventListener("load", notifyVisit);
