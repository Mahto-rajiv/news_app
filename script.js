// Your Vercel Proxy URL
const url = "/api/proxy";

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  fetchNews("India"); // Initial news fetch
});

function initializeApp() {
  // Set up event listeners
  setupNavigationListeners();
  setupSearchListeners();
  setupMenuListeners();
}

function setupNavigationListeners() {
  // Logo click handler
  document.querySelector(".Rajiv-News").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
  });

  // Navigation items click handlers
  document.querySelectorAll(".nav-items").forEach((item) => {
    item.addEventListener("click", () => {
      onNavItemClick(item.id);
    });
  });
}

function setupSearchListeners() {
  const searchButton = document.getElementById("search-button");
  const searchText = document.getElementById("search-text");

  // Search button click handler
  searchButton.addEventListener("click", () => {
    handleSearch();
  });

  // Enter key handler for search
  searchText.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
}

function setupMenuListeners() {
  // Hamburger menu click handler
  document.querySelector(".hamburger").addEventListener("click", toggleMenu);

  // Click outside handler
  document.addEventListener("click", handleClickOutside);

  // Nav links area click handler
  document
    .querySelector(".nav-links")
    .addEventListener("click", handleNavLinksClick);
}

function handleSearch() {
  const searchText = document.getElementById("search-text");
  const query = searchText.value;
  if (!query) return;

  closeMenu();
  fetchNews(query);
  currentSelectedNavItem?.classList.remove("active");
  currentSelectedNavItem = null;
  searchText.value = "";
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${url}?query=${query}`);
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

  newsSource.innerHTML = `${article.source.name} · ${date}`;

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

function handleClickOutside(event) {
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
}

function handleNavLinksClick(event) {
  // If clicking on a nav item or search button, menu will close automatically
  if (
    event.target.classList.contains("nav-items") ||
    event.target.classList.contains("search-button")
  ) {
    closeMenu();
  }

  // Prevent the click from bubbling up if it's in the search area
  if (event.target.closest(".search-bar")) {
    event.stopPropagation();
  }
}

// Visitor tracking function - commented out for now
async function notifyVisit() {
  try {
    const response = await fetch("https://ipinfo.io/json?token=YOUR_TOKEN");
    const data = await response.json();

    const visitorData = {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      userAgent: navigator.userAgent,
      visitTime: new Date().toLocaleString(),
    };

    await fetch("http://localhost:3000/api/notify-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorData),
    });
  } catch (error) {
    console.error("Failed to notify visit:", error);
  }
}
