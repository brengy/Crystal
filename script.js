// DOM Elements
const searchInput = document.getElementById("searchInput");
const paginationControls = document.getElementById("paginationControls");
const cartContainer = document.getElementById("cartContainer");
const categorySelect = document.getElementById("categorySelect");

// Get all cards from both categories
const penCards = Array.from(document.querySelectorAll("#penCards .card"));
const bookCards = Array.from(document.querySelectorAll("#bookCards .card"));
let allCards = [...penCards, ...bookCards]; // Combine all cards into one array

let currentPage = 1;
const cardsPerPage = 1000; // Limit to 10 cards per page

// Render Cards Function
function renderCards(cards, page) {
  const start = (page - 1) * cardsPerPage;
  const end = page * cardsPerPage;

  // Hide all cards
  allCards.forEach(card => card.style.display = "none");

  // Show only the cards for the current page
  const paginatedCards = cards.slice(start, end);
  paginatedCards.forEach(card => card.style.display = "block");
}

// Render Pagination Controls
function renderPagination(totalPages) {
  paginationControls.innerHTML = ""; // Clear previous buttons

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.toggle("active", i === currentPage);
    button.addEventListener("click", () => {
      currentPage = i;
      renderCards(allCards, currentPage);
    });
    paginationControls.appendChild(button);
  }
}

// Initial Render
renderCards(allCards, currentPage);
renderPagination(Math.ceil(allCards.length / cardsPerPage));

// Search Functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  // Filter all cards by name
  const filteredCards = allCards.filter(card =>
    card.getAttribute("data-name").toLowerCase().includes(query)
  );

  currentPage = 1; // Reset to first page after search

  // Re-render cards and pagination
  renderCards(filteredCards, currentPage);
  renderPagination(Math.ceil(filteredCards.length / cardsPerPage));
});

// Cart Functionality
const cartItems = new Set(); // Use a Set to avoid duplicates

function addToCart(card) {
  const itemName = card.getAttribute("data-name");
  const itemImage = card.querySelector("img").src;

  // Check if the item is already in the cart
  if (cartItems.has(itemName)) {
    alert(`${itemName} is already in your cart.`);
    return;
  }

  // Add item to the cart
  cartItems.add(itemName);

  // Create a cart item element
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");

  const img = document.createElement("img");
  img.src = itemImage;
  img.alt = itemName;

  const name = document.createElement("p");
  name.textContent = itemName;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "×";
  removeBtn.onclick = () => removeFromCart(cartItem, itemName);

  cartItem.appendChild(img);
  cartItem.appendChild(name);
  cartItem.appendChild(removeBtn);

  // Append to cart container
  cartContainer.appendChild(cartItem);

  // Hide the empty cart message
  const emptyMessage = document.querySelector(".empty-cart-message");
  if (emptyMessage) emptyMessage.style.display = "none";
}

function removeFromCart(cartItem, itemName) {
  cartItems.delete(itemName); // Remove from Set
  cartItem.remove(); // Remove from DOM

  // Show the empty cart message if no items are left
  if (cartItems.size === 0) {
    const emptyMessage = document.querySelector(".empty-cart-message");
    if (emptyMessage) emptyMessage.style.display = "block";
  }
}

// Attach Click Event Listeners to All Cards
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => addToCart(card));
});

// Send Cart Contents to WhatsApp
document.getElementById("sendToWhatsApp").addEventListener("click", () => {
  if (cartItems.size === 0) {
    alert("Your cart is empty. Add items to the cart before sending.");
    return;
  }

  // Format cart items into a message
  let message = "My Cart:\n\n";
  document.querySelectorAll(".cart-item").forEach(item => {
    const itemName = item.querySelector("p").textContent;
    message += `- ${itemName}\n`;
  });

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message.trim()); // Trim whitespace

  // Create the WhatsApp link
  const whatsappLink = `https://wa.me/?text= ${encodedMessage}`;

  // Open the link in a new tab
  window.open(whatsappLink, "_blank");
});

// Populate the combobox with categories
const categories = Array.from(document.querySelectorAll(".category h2")).map(h2 => h2.textContent);

categories.forEach(category => {
  const option = document.createElement("option");
  option.value = category.toLowerCase(); // Use lowercase for consistency
  option.textContent = category;
  categorySelect.appendChild(option);
});

// Event Listener for Category Selection
categorySelect.addEventListener("change", () => {
  const selectedCategory = categorySelect.value;

  // Filter cards based on the selected category
  if (selectedCategory === "all") {
    renderCards(allCards, currentPage); // Show all cards
  } else {
    const filteredCards = allCards.filter(card => {
      const cardCategory = card.closest(".category").querySelector("h2").textContent.toLowerCase();
      return cardCategory === selectedCategory;
    });

    renderCards(filteredCards, currentPage); // Show filtered cards
  }

  // Update pagination
  renderPagination(Math.ceil((selectedCategory === "all" ? allCards.length : filteredCards.length) / cardsPerPage));
});