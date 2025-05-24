// script.js

// DOM Elements
const searchInput = document.getElementById("searchInput");
const penCardContainer = document.getElementById("penCards");
const bookCardContainer = document.getElementById("bookCards");
const paginationControls = document.getElementById("paginationControls");

let currentPage = 1;
const cardsPerPage = 10;

// Get all cards
const penCards = Array.from(penCardContainer.querySelectorAll(".card"));
const bookCards = Array.from(bookCardContainer.querySelectorAll(".card"));

// Render Cards Function
function renderCards(cards, container, page) {
  const start = (page - 1) * cardsPerPage;
  const end = page * cardsPerPage;

  // Hide all cards
  cards.forEach(card => card.style.display = "none");

  // Show only the cards for the current page
  const paginatedCards = cards.slice(start, end);
  paginatedCards.forEach(card => card.style.display = "block");
}

// Render Pagination Controls
function renderPagination(totalPages, callback) {
  paginationControls.innerHTML = ""; // Clear previous buttons

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.toggle("active", i === currentPage);
    button.addEventListener("click", () => {
      currentPage = i;
      callback();
    });
    paginationControls.appendChild(button);
  }
}

// Search Functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  // Filter pens and books
  const filteredPenCards = penCards.filter(card =>
    card.getAttribute("data-name").toLowerCase().includes(query)
  );
  const filteredBookCards = bookCards.filter(card =>
    card.getAttribute("data-name").toLowerCase().includes(query)
  );

  currentPage = 1; // Reset to first page after search

  // Re-render cards and pagination
  renderCards(filteredPenCards, penCardContainer, currentPage);
  renderCards(filteredBookCards, bookCardContainer, currentPage);

  renderPagination(Math.ceil(filteredPenCards.length / cardsPerPage), () => {
    renderCards(filteredPenCards, penCardContainer, currentPage);
    renderCards(filteredBookCards, bookCardContainer, currentPage);
  });
});

// Initial Render
renderCards(penCards, penCardContainer, currentPage);
renderCards(bookCards, bookCardContainer, currentPage);
renderPagination(Math.ceil(penCards.length / cardsPerPage), () => {
  renderCards(penCards, penCardContainer, currentPage);
  renderCards(bookCards, bookCardContainer, currentPage);
});