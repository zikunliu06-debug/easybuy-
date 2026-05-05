import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [adminUsers, setAdminUsers] = useState([]);
  const [adminCarts, setAdminCarts] = useState([]);

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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const fetchProducts = () => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const fetchCart = (userId) => {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setCart(data));
  };

  const fetchAdminData = () => {
    fetch("http://localhost:3000/admin/users")
      .then((res) => res.json())
      .then((data) => setAdminUsers(data));

    fetch("http://localhost:3000/admin/carts")
      .then((res) => res.json())
      .then((data) => setAdminCarts(data));
  };

  const register = async () => {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    showToast(data.message || data.error);
  };

  const login = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Login success");

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCart([]);
    setAdminUsers([]);
    setAdminCarts([]);
    setUsername("");
    setPassword("");
    showToast("Logged out");
  };

  const switchUser = () => {
    logout();
    showToast("Please login another account");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addToCart = async (product) => {
    await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product._id,
        userId: user._id,
        username: user.username
      })
    });

    showToast(`${product.name} added`);
    fetchCart(user._id);
  };

  const increaseQuantity = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "increase" })
    });

    fetchCart(user._id);
  };

  const decreaseQuantity = async (id) => {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "decrease" })
    });

    fetchCart(user._id);
  };

  const removeFromCart = async (id) => {
    if (!window.confirm("Remove this item?")) return;

    await fetch(`http://localhost:3000/cart/${id}`, {
      method: "DELETE"
    });

    showToast("Removed");
    fetchCart(user._id);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!user) {
    return (
      <div className="app-container">
        <h1>EasyBuy Login</h1>

        <div className="login-box">
          <input
            className="search-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="search-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>

          <p style={{ marginTop: "20px", fontSize: "14px" }}>
            Admin demo account: <strong>admin / Admin123!</strong>
          </p>
        </div>

        <div className={`toast ${toast ? "show" : ""}`}>
          {toast}
        </div>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="app-container">
        <div className="top-bar">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.username} ({user.role})</p>
          <button onClick={switchUser}>Switch User</button>
          <button onClick={logout}>Logout</button>
        </div>

        <h2>All Users</h2>
        <div className="admin-table">
          <div className="admin-row admin-header">
            <span>Username</span>
            <span>Role</span>
            <span>User ID</span>
          </div>

          {adminUsers.map((u) => (
            <div key={u._id} className="admin-row">
              <span>{u.username}</span>
              <span>{u.role}</span>
              <span>{u._id}</span>
            </div>
          ))}
        </div>

        <h2>All Customers' Shopping Carts</h2>
        <div className="admin-table">
          <div className="admin-row admin-header">
            <span>Customer</span>
            <span>Product</span>
            <span>Quantity</span>
          </div>

          {adminCarts.map((item) => (
            <div key={item._id} className="admin-row">
              <span>{item.username}</span>
              <span>{item.name}</span>
              <span>{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className={`toast ${toast ? "show" : ""}`}>
          {toast}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="top-bar">
        <h1>EasyBuy</h1>
        <p>Welcome, {user.username} ({user.role})</p>

        
        <button onClick={logout}>Logout</button>
      </div>

      <input
        className="search-input"
        placeholder="Search products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="card">
            <img
              className="product-image"
              src={product.image}
              alt={product.name}
            />

            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>

            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "40px" }}>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <strong>{item.name}</strong>
              <p>Quantity: {item.quantity}</p>

              <button onClick={() => increaseQuantity(item._id)}>+</button>
              <button onClick={() => decreaseQuantity(item._id)}>-</button>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>
        </>
      )}

      <div className={`toast ${toast ? "show" : ""}`}>
        {toast}
      </div>
    </div>
  );
}

export default App;