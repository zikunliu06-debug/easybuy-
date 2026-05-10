import { useEffect, useState } from "react";
import "./App.css";

// ─── Sub-components ────────────────────────────────────────────────────────────

function Toast({ message }) {
  return (
    <div className={`toast ${message ? "show" : ""}`}>
      {message}
    </div>
  );
}

function Navbar({ user, cartCount, onLogout, onTabChange, activeTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">🛍</span>
        EasyBuy
      </div>
      {user && user.role !== "admin" && (
        <div className="navbar-tabs">
          <button
            className={`tab-btn ${activeTab === "shop" ? "active" : ""}`}
            onClick={() => onTabChange("shop")}
          >
            Shop
          </button>
          <button
            className={`tab-btn ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => onTabChange("cart")}
          >
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      )}
      {user && (
        <div className="navbar-right">
          <span className="welcome-text">
            {user.role === "admin" ? "👑" : "👤"} {user.username}
          </span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function LoginPage({ onLogin, onRegister, toast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    await onLogin(username, password);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    await onRegister(username, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🛍</span>
          <h1>EasyBuy</h1>
          <p className="auth-subtitle">Sign in to start shopping</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <p className="inline-error">{error}</p>}

          <div className="auth-btns">
            <button className="btn-primary" onClick={handleLogin}>
              Login
            </button>
            <button className="btn-secondary" onClick={handleRegister}>
              Register
            </button>
          </div>

          <p className="demo-hint">
            Demo admin: <code>admin / Admin123!</code>
          </p>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}

function ProductCard({ product, onAddToCart, loggedIn }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
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

function ShopPage({ products, searchText, onSearchChange, onAddToCart, user }) {
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page">
      <div className="shop-header">
        <h2>All Products</h2>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchText && (
            <button className="search-clear" onClick={() => onSearchChange("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>🔎</span>
          <p>No products found for "{searchText}"</p>
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

function CartPage({ cart, onIncrease, onDecrease, onRemove }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      <h2>Your Cart</h2>
      <div className="cart-list">
        {cart.map((item) => (
          <div key={item._id} className="cart-row">
            <div className="cart-item-info">
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-unit">${item.price.toFixed(2)} each</p>
            </div>
            <div className="cart-controls">
              <button className="qty-btn" onClick={() => onDecrease(item._id)}>−</button>
              <span className="qty-num">{item.quantity}</span>
              <button className="qty-btn" onClick={() => onIncrease(item._id)}>+</button>
            </div>
            <p className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button className="btn-remove" onClick={() => onRemove(item._id)}>
              🗑
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

function AdminPage({ users, carts, onLogout }) {
  return (
    <div className="page admin-page">
      <div className="admin-hero">
        <h2>Admin Dashboard</h2>
        <p className="admin-sub">Overview of all users and their carts</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-num">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{carts.length}</span>
          <span className="stat-label">Cart Items</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">
            ${carts.reduce((s, i) => s + (i.price || 0) * i.quantity, 0).toFixed(2)}
          </span>
          <span className="stat-label">Total Value</span>
        </div>
      </div>

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
              <span className={`role-badge ${u.role}`}>{u.role}</span>
            </span>
            <span className="mono">{u._id}</span>
          </div>
        ))}
      </div>

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

// ─── Main App ──────────────────────────────────────────────────────────────────

function App() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminCarts, setAdminCarts] = useState([]);
  const [activeTab, setActiveTab] = useState("shop");

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
      fetchProducts();
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const getToken = () => localStorage.getItem("token");

  const fetchProducts = () => {
    fetch("http://localhost:3000/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => showToast("Failed to load products"));
  };

  const fetchCart = (userId) => {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
      .then((r) => r.json())
      .then(setCart)
      .catch(() => showToast("Failed to load cart"));
  };

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

  const handleRegister = async (username, password) => {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    showToast(data.message || data.error);
  };

  const handleLogin = async (username, password) => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.user && data.token) {
      setUser(data.user);
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

  const increaseQuantity = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "increase" }),
    });
    fetchCart(user._id);
  };

  const decreaseQuantity = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "decrease" }),
    });
    fetchCart(user._id);
  };

  const removeFromCart = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, { method: "DELETE" });
    showToast("Item removed");
    fetchCart(user._id);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        toast={toast}
      />
    );
  }

  if (user.role === "admin") {
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <AdminPage users={adminUsers} carts={adminCarts} />
        <Toast message={toast} />
      </>
    );
  }

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