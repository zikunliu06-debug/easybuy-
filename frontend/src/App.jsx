/**
 * App.jsx — EasyBuy Frontend
 * Author: Zikun Liu
 *
 * Single-page e-commerce application built with React.
 * Supports two roles: regular user (shop + cart) and admin (dashboard).
 * Authentication is handled via JWT stored in localStorage.
 *
 * Component structure:
 *   App                  — root component, manages global state and API calls
 *   ├── LoginPage        — register / login form with inline validation
 *   ├── Navbar           — sticky top bar with tab navigation and cart badge
 *   ├── ShopPage         — product grid with live search + category filter
 *   │   ├── ProductCard  — individual product card with star rating
 *   │   └── StarRating   — renders star icons based on a numeric rating
 *   ├── CartPage         — user's cart with quantity controls and total
 *   │   └── ConfirmDialog — modal confirmation before removing an item
 *   ├── AdminPage        — admin-only dashboard: all users + all carts
 *   └── Toast            — transient bottom-right notification
 */

import { useEffect, useState } from "react";
import "./App.css";
import {
  FiShoppingBag, FiShoppingCart, FiLogOut, FiUser, FiLock,
  FiGrid, FiTag, FiMonitor, FiHome, FiFeather,
  FiUsers, FiDollarSign, FiTrash2, FiPlus, FiMinus, FiSearch
} from "react-icons/fi";

// ─── Toast ─────────────────────────────────────────────────────────────────────
// Displays a brief notification at the bottom-right of the screen.
// Visibility is controlled by whether `message` is non-empty.
function Toast({ message }) {
  return (
    <div className={`toast ${message ? "show" : ""}`}>
      {message}
    </div>
  );
}

// ─── ConfirmDialog ─────────────────────────────────────────────────────────────
// Custom modal that replaces window.confirm() for cart item removal.
// Clicking the overlay background also cancels the action (UX best practice).
function ConfirmDialog({ show, itemName, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      {/* stopPropagation prevents clicks inside the box from closing it */}
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">🗑</div>
        <h3 className="dialog-title">Remove Item</h3>
        <p className="dialog-msg">
          Remove <strong>{itemName}</strong> from your cart?
        </p>
        <div className="dialog-btns">
          <button className="dialog-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="dialog-btn-confirm" onClick={onConfirm}>Remove</button>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
// Sticky top navigation bar.
// - Shows Shop/Cart tabs only for regular users (not admin).
// - Cart badge displays total item quantity when > 0.
// - Role icon differentiates admin (👑) from regular user (👤).
function Navbar({ user, cartCount, onLogout, onTabChange, activeTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">🛍</span>
        EasyBuy
      </div>

      {/* Tab navigation — hidden for admin since they use the dashboard */}
      {user && user.role !== "admin" && (
        <div className="navbar-tabs">
          <button
            className={`tab-btn ${activeTab === "shop" ? "active" : ""}`}
            onClick={() => onTabChange("shop")}
          >
            <FiShoppingBag /> Shop
          </button>
          <button
            className={`tab-btn ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => onTabChange("cart")}
          >
            <FiShoppingCart /> Cart
            {/* Badge shows total quantity across all cart items */}
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      )}

      {user && (
        <div className="navbar-right">
          <span className="welcome-text">
            {user.role === "admin" ? "👑" : <FiUser style={{verticalAlign:"middle"}}/>} {user.username}
          </span>
          <button className="btn-logout" onClick={onLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── LoginPage ─────────────────────────────────────────────────────────────────
// Two separate tabs: Login and Register, toggled by `authMode` state.
// - Switching tabs clears all inputs and errors for a clean experience.
// - Inline error messages replace browser alert() for better UX.
// - Enter key submits the current active tab's form.
function LoginPage({ onLogin, onRegister, toast }) {
  // "login" | "register" — controls which tab is active
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Clears all fields and errors when switching between tabs
  const switchMode = (mode) => {
    setAuthMode(mode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    await onLogin(username, password);
  };

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    await onRegister(username, password);
  };

  const isLogin = authMode === "login";

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo header */}
        <div className="auth-header">
          <span className="auth-logo">🛍</span>
          <h1>EasyBuy</h1>
          <p className="auth-subtitle">Your everyday shopping destination</p>
        </div>

        {/* Tab switcher — Login / Register */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-form">
          {/* Username field — shared by both modes */}
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrap">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (isLogin ? handleLogin() : handleRegister())}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (isLogin ? handleLogin() : handleRegister())}
              />
            </div>
          </div>

          {/* Confirm password — only shown in Register mode */}
          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>
          )}

          {/* Inline validation error */}
          {error && <p className="inline-error">{error}</p>}

          {/* Single action button changes label based on active tab */}
          <button
            className="btn-primary btn-full"
            onClick={isLogin ? handleLogin : handleRegister}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>

          {/* Switch mode hint at the bottom */}
          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              className="auth-switch-link"
              onClick={() => switchMode(isLogin ? "register" : "login")}
            >
              {isLogin ? "Register here" : "Sign in"}
            </span>
          </p>

          {isLogin && (
            <p className="demo-hint">
              Demo admin: <code>admin / Admin123!</code>
            </p>
          )}
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}

// ─── StarRating helpers ────────────────────────────────────────────────────────

// Derives a consistent pseudo-random rating from the product's MongoDB _id.
// Uses the last character's char code to pick from a fixed array of ratings.
// This avoids needing a real ratings field in the database.
function getStarRating(id) {
  const stars = [4.2, 4.5, 4.7, 4.3, 4.8, 4.1, 4.6, 4.4];
  const index = id ? id.charCodeAt(id.length - 1) % stars.length : 0;
  return stars[index];
}

// Renders filled (★), half (½), and empty (☆) star characters.
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.4;
  return (
    <div className="star-row">
      <span className="stars">
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span className="star-num">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── ProductCard ───────────────────────────────────────────────────────────────
// Displays a single product with image, category badge, name, rating, and price.
// - useState `added` gives visual feedback when item is added to cart.
// - "Add to Cart" button is only shown to logged-in users.
function ProductCard({ product, onAddToCart, loggedIn }) {
  const [added, setAdded] = useState(false);
  const rating = getStarRating(product._id);

  // Triggers add-to-cart and temporarily shows a "Added!" confirmation state
  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" />
        {/* Category badge overlaid on the product image */}
        <span className="category-badge">{product.category}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <StarRating rating={rating} />
        <p className="product-price">${product.price.toFixed(2)}</p>
        {loggedIn && (
          <button
            className={`btn-add-cart ${added ? "added" : ""}`}
            onClick={handleAdd}
          >
            {added ? "✓ Added!" : "+ Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

// Category icon map — each category gets a matching react-icon
const CATEGORY_ICONS = {
  All: <FiGrid />,
  Fashion: <FiTag />,
  Electronics: <FiMonitor />,
  Home: <FiHome />,
  Beauty: <FiFeather />,
};

// Available product categories — "All" is a virtual option that shows everything
const CATEGORIES = ["All", "Fashion", "Electronics", "Home", "Beauty"];

// ─── ShopPage ──────────────────────────────────────────────────────────────────
// Main shopping page with hero banner, category tabs, live search, and product grid.
// Filtering combines both search text and category simultaneously (AND logic).
function ShopPage({ products, searchText, onSearchChange, onAddToCart, user }) {
  // Category filter state — defaults to "All" (show everything)
  const [activeCategory, setActiveCategory] = useState("All");

  // Combined filter: product must match both the search text AND the selected category
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page">
      {/* Hero banner — decorative welcome section at the top of the shop */}
      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-sub">Welcome to</p>
          <h1 className="hero-title">EasyBuy 🛍</h1>
          <p className="hero-desc">Discover quality products at great prices</p>
        </div>
      </div>

      {/* Controls row: category filter tabs (left) + search bar (right) */}
      <div className="shop-controls">
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Live search — filters in real-time on every keystroke via onChange */}
        <div className="search-wrap">
          <FiSearch className="search-icon" />
          <input
            className="search-input"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {/* Clear button only appears when there is text in the search input */}
          {searchText && (
            <button className="search-clear" onClick={() => onSearchChange("")}>✕</button>
          )}
        </div>
      </div>

      {/* Dynamic result count updates as filters change */}
      <p className="results-count">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        {searchText ? ` for "${searchText}"` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>🔎</span>
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={onAddToCart}
              loggedIn={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CartPage ──────────────────────────────────────────────────────────────────
// Displays the current user's cart items with quantity controls and total price.
// - Uses local state `confirmItem` to track which item is pending deletion.
// - Replaces browser confirm() with a custom ConfirmDialog component.
function CartPage({ cart, onIncrease, onDecrease, onRemove }) {
  // Stores the item the user clicked "remove" on — null means dialog is closed
  const [confirmItem, setConfirmItem] = useState(null);

  // Calculates total price by summing price * quantity for all cart items
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Opens the confirm dialog with the selected item's details
  const handleRemoveClick = (item) => {
    setConfirmItem(item);
  };

  // Called when user confirms removal in the dialog
  const handleConfirm = () => {
    onRemove(confirmItem._id);
    setConfirmItem(null);
  };

  // Called when user cancels — closes dialog without any action
  const handleCancel = () => {
    setConfirmItem(null);
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <h2>Your Cart</h2>
        <div className="empty-state">
          <span>🛒</span>
          <p>Your cart is empty. Go add something!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Confirm dialog — rendered conditionally based on confirmItem state */}
      <ConfirmDialog
        show={!!confirmItem}
        itemName={confirmItem?.name}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <h2>Your Cart</h2>
      <div className="cart-list">
        {cart.map((item) => (
          <div key={item._id} className="cart-row">
            <div className="cart-item-info">
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-unit">${item.price.toFixed(2)} each</p>
            </div>
            {/* Quantity controls: decrease / display / increase */}
            <div className="cart-controls">
              <button className="qty-btn" onClick={() => onDecrease(item._id)}><FiMinus /></button>
              <span className="qty-num">{item.quantity}</span>
              <button className="qty-btn" onClick={() => onIncrease(item._id)}><FiPlus /></button>
            </div>
            {/* Line subtotal = price × quantity */}
            <p className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button className="btn-remove" onClick={() => handleRemoveClick(item)}>
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

// ─── AdminPage ─────────────────────────────────────────────────────────────────
// Admin-only dashboard view. Accessible only after verifyAdmin middleware on backend.
// Displays:
//   - Summary stats (user count, cart item count, total cart value)
//   - Full user list with role badges
//   - All customers' cart contents across all accounts
function AdminPage({ users, carts }) {
  return (
    <div className="page admin-page">
      <div className="admin-hero">
        <h2>Admin Dashboard</h2>
        <p className="admin-sub">Overview of all users and their carts</p>
      </div>

      {/* Summary stat cards — quick overview at a glance */}
      <div className="admin-stats">
        <div className="stat-card">
          <FiUsers className="stat-icon" />
          <span className="stat-num">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <FiShoppingCart className="stat-icon" />
          <span className="stat-num">{carts.length}</span>
          <span className="stat-label">Cart Items</span>
        </div>
        <div className="stat-card">
          <FiDollarSign className="stat-icon" />
          {/* Aggregates total monetary value across all carts */}
          <span className="stat-num">
            ${carts.reduce((s, i) => s + (i.price || 0) * i.quantity, 0).toFixed(2)}
          </span>
          <span className="stat-label">Total Value</span>
        </div>
      </div>

      {/* User table — password field excluded by backend (.select("-password")) */}
      <h3>All Users</h3>
      <div className="admin-table">
        <div className="admin-thead">
          <span>Username</span>
          <span>Role</span>
          <span>User ID</span>
        </div>
        {users.map((u) => (
          <div key={u._id} className="admin-row">
            <span>{u.username}</span>
            <span>
              {/* Role badge styled differently for admin vs user */}
              <span className={`role-badge ${u.role}`}>{u.role}</span>
            </span>
            <span className="mono">{u._id}</span>
          </div>
        ))}
      </div>

      {/* Cart table — shows all items across every user's cart */}
      <h3>All Shopping Carts</h3>
      <div className="admin-table">
        <div className="admin-thead">
          <span>Customer</span>
          <span>Product</span>
          <span>Quantity</span>
        </div>
        {carts.map((item) => (
          <div key={item._id} className="admin-row">
            <span>{item.username}</span>
            <span>{item.name}</span>
            <span>{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App (Root Component) ──────────────────────────────────────────────────────
// Manages all global state and API communication.
// Renders the correct view based on auth state and user role:
//   - Not logged in  → LoginPage
//   - Admin user     → Navbar + AdminPage
//   - Regular user   → Navbar + ShopPage or CartPage (tab-controlled)
function App() {
  const [products, setProducts] = useState([]);       // all products from MongoDB
  const [searchText, setSearchText] = useState("");   // live search input value
  const [cart, setCart] = useState([]);               // current user's cart items
  const [toast, setToast] = useState("");             // toast notification message
  const [user, setUser] = useState(null);             // logged-in user object (or null)
  const [adminUsers, setAdminUsers] = useState([]);   // all users (admin only)
  const [adminCarts, setAdminCarts] = useState([]);   // all cart items (admin only)
  const [activeTab, setActiveTab] = useState("shop"); // "shop" | "cart"

  // On mount: restore session from localStorage if token exists.
  // This allows users to stay logged in after a page refresh.
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === "admin") {
        fetchAdminData();
      } else {
        fetchProducts();
        fetchCart(parsedUser._id);
      }
    } else {
      // Load products even without login so guests can browse
      fetchProducts();
    }
  }, []);

  // Displays a toast for 2.2 seconds then clears it
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Helper to retrieve JWT from localStorage for protected API requests
  const getToken = () => localStorage.getItem("token");

  // ── API calls ────────────────────────────────────────────────────────────────

  // Fetches all products from the backend (public endpoint, no auth required)
  const fetchProducts = () => {
    fetch("http://localhost:3000/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => showToast("Failed to load products"));
  };

  // Fetches the cart for a specific user by their MongoDB _id
  const fetchCart = (userId) => {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
      .then((r) => r.json())
      .then(setCart)
      .catch(() => showToast("Failed to load cart"));
  };

  // Fetches admin data — both requests include the JWT in Authorization header.
  // Backend verifies the token and checks role === "admin" before responding.
  const fetchAdminData = () => {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    fetch("http://localhost:3000/admin/users", { headers })
      .then((r) => r.json())
      .then(setAdminUsers);
    fetch("http://localhost:3000/admin/carts", { headers })
      .then((r) => r.json())
      .then(setAdminCarts);
  };

  // Sends registration request; password is hashed server-side with bcrypt
  const handleRegister = async (username, password) => {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    showToast(data.message || data.error);
  };

  // Sends login request; on success stores JWT + user object in localStorage
  // for session persistence across page refreshes.
  const handleLogin = async (username, password) => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.user && data.token) {
      setUser(data.user);
      // Persist session so the user stays logged in on page refresh
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      showToast("Welcome back, " + data.user.username + "!");
      if (data.user.role === "admin") {
        fetchAdminData();
      } else {
        fetchProducts();
        fetchCart(data.user._id);
      }
    } else {
      showToast(data.error || "Login failed");
    }
  };

  // Clears all session data from state and localStorage on logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCart([]);
    setAdminUsers([]);
    setAdminCarts([]);
    setActiveTab("shop");
    showToast("Logged out successfully");
  };

  // Adds a product to the cart (or increments quantity if already present).
  // Backend handles the duplicate check — if item exists, it increments quantity.
  const addToCart = async (product) => {
    await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product._id,
        userId: user._id,
        username: user.username,
      }),
    });
    showToast(`${product.name} added to cart`);
    fetchCart(user._id);
  };

  // Sends a PUT request with action "increase" to increment quantity by 1
  const increaseQuantity = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "increase" }),
    });
    fetchCart(user._id);
  };

  // Sends a PUT request with action "decrease"; backend auto-deletes if quantity hits 0
  const decreaseQuantity = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "decrease" }),
    });
    fetchCart(user._id);
  };

  // Hard-deletes a cart item by its MongoDB _id (called after user confirms dialog)
  const removeFromCart = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, { method: "DELETE" });
    showToast("Item removed");
    fetchCart(user._id);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  // Guard: show login page if no user is authenticated
  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        toast={toast}
      />
    );
  }

  // Admin view: dashboard with user and cart management
  if (user.role === "admin") {
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <AdminPage users={adminUsers} carts={adminCarts} />
        <Toast message={toast} />
      </>
    );
  }

  // Regular user view: shop or cart, toggled via Navbar tabs
  return (
    <>
      <Navbar
        user={user}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />
      <main className="main-content">
        {activeTab === "shop" ? (
          <ShopPage
            products={products}
            searchText={searchText}
            onSearchChange={setSearchText}
            onAddToCart={addToCart}
            user={user}
          />
        ) : (
          <CartPage
            cart={cart}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
          />
        )}
      </main>
      <Toast message={toast} />
    </>
  );
}

export default App;