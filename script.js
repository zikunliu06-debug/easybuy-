let products = [];
let cart = [];

const productList = document.getElementById("product-list");
const categoryButtons = document.querySelectorAll(".category-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function displayProducts(productArray) {
  productList.innerHTML = "";

  if (productArray.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  productArray.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart('${product._id}')">Add to Cart</button>
    `;

    productList.appendChild(productCard);
  });
}

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const data = await response.json();
    products = data;
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
}

async function fetchCart() {
  try {
    const response = await fetch("http://localhost:3000/cart");
    const data = await response.json();
    cart = data;
    renderCart();
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

async function addToCart(productId) {
  try {
    await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId })
    });

    fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

async function increaseQuantity(cartItemId) {
  try {
    await fetch(`http://localhost:3000/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "increase" })
    });

    fetchCart();
  } catch (error) {
    console.error("Error increasing quantity:", error);
  }
}

async function decreaseQuantity(cartItemId) {
  try {
    await fetch(`http://localhost:3000/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "decrease" })
    });

    fetchCart();
  } catch (error) {
    console.error("Error decreasing quantity:", error);
  }
}

async function removeFromCart(cartItemId) {
  try {
    await fetch(`http://localhost:3000/cart/${cartItemId}`, {
      method: "DELETE"
    });

    fetchCart();
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">No items yet.</p>`;
    cartTotal.textContent = "Total: $0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: $${item.price.toFixed(2)}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      <div class="cart-controls">
        <button onclick="increaseQuantity('${item._id}')">+</button>
        <button onclick="decreaseQuantity('${item._id}')">-</button>
        <button onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.category;

    if (selectedCategory === "All") {
      displayProducts(products);
    } else {
      const filteredProducts = products.filter((product) => {
        return product.category === selectedCategory;
      });
      displayProducts(filteredProducts);
    }
  });
});

function searchProducts() {
  const keyword = searchInput.value.toLowerCase().trim();

  if (keyword === "") {
    displayProducts(products);
    return;
  }

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(keyword);
  });

  displayProducts(filteredProducts);
}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchProducts();
  }
});

fetchProducts();
fetchCart();