# EasyBuy 🛍

A full-stack e-commerce shopping cart application built with React, Node.js, Express, and MongoDB. Users can browse and search products, manage their shopping cart, and administrators can monitor all user accounts and cart activity.

---

## Features

- **User Authentication** — Separate login and register tabs with password hashing (bcrypt) and JWT-based session management; session persists across page refreshes via localStorage
- **Role-Based Access Control** — Regular users access the shop and cart; admin users access a full dashboard with all user and cart data
- **Live Search** — Real-time product filtering as the user types, no page reload required
- **Category Filter** — Filter products by category (Fashion, Electronics, Home, Beauty) combined with live search simultaneously
- **Shopping Cart** — Add, increase, decrease, and remove items; persistent per user in MongoDB; shows per-item subtotal and cart total
- **Confirm Dialog** — Custom modal confirmation before removing a cart item (replaces browser `window.confirm`)
- **Toast Notifications** — Non-intrusive bottom-right notifications for add, remove, login, and logout actions
- **Admin Dashboard** — Summary stats (total users, cart items, total value) plus full user list; click any user to filter and view their individual cart; empty cart state shown if user has no items
- **React Icons** — Feather icons used throughout navbar, login form, category tabs, cart controls, and admin dashboard
- **Single-Page Application** — Built with React; all views rendered dynamically without full page reloads
- **Responsive Design** — Adapts to mobile and desktop screen sizes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Icons | react-icons (Feather) |
| Styling | Custom CSS (Modern Navy colour scheme) |

---

## Project Structure

```
easybuy/
├── frontend/                   # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx             # All React components and app logic
│   │   └── App.css             # Global styles (Modern Navy colour system, responsive layout)
│   ├── public/
│   │   └── image/              # Product images
│   ├── index.html
│   └── package.json
│
├── backend/                    # Node.js + Express API
│   ├── server.js               # Entry point — all routes and middleware
│   ├── models/
│   │   ├── User.js             # User schema (username, password, role)
│   │   ├── Product.js          # Product schema (name, price, category, image)
│   │   └── Cart.js             # Cart item schema (userId, productId, quantity)
│   ├── seedProducts.js         # Script to seed initial product data
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/zikunliu06-debug/easybuy-
cd easybuy-
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb://localhost:27017/easybuy
JWT_SECRET=your_secret_key
PORT=3000
```

Then run:

```bash
node server.js
```

The API will be available at `http://localhost:3000`.

### 3. Seed the database (first time only)

```bash
node seedProducts.js
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | — |
| POST | `/login` | Login, returns JWT token | — |
| GET | `/products` | Get all products | — |
| GET | `/cart?userId=` | Get cart items for a user | — |
| POST | `/cart` | Add item to cart (increments if exists) | — |
| PUT | `/cart/:id` | Increase or decrease item quantity | — |
| DELETE | `/cart/:id` | Remove item from cart | — |
| GET | `/admin/users` | Get all users (passwords excluded) | Admin JWT |
| GET | `/admin/carts` | Get all cart items across all users | Admin JWT |

---

## Database Collections

The application uses three MongoDB collections corresponding to the three CRUD entities required by the assignment:

- **users** — registered accounts with hashed passwords and roles (`user` / `admin`)
- **products** — product catalogue with name, price, category, and image path
- **cartitems** — each user's cart entries with product reference and quantity

A sample database export is available in the `/backend/` folder as JSON files importable with `mongoimport`.

---

## Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin123!` |

Register any username/password to create a regular user account.

---

## Workload Allocation

This project was completed individually by **Zikun Liu**.

| File | Description |
|------|-------------|
| `frontend/src/App.jsx` | All React components: Navbar, LoginPage, ShopPage, ProductCard, StarRating, CartPage, AdminPage, Toast, ConfirmDialog |
| `frontend/src/App.css` | All styles including Modern Navy colour system, responsive layout, animations |
| `backend/server.js` | All API routes, JWT middleware, bcrypt password hashing, role-based access control |
| `backend/models/User.js` | Mongoose User model |
| `backend/models/Product.js` | Mongoose Product model |
| `backend/models/Cart.js` | Mongoose Cart item model |
| `backend/seedProducts.js` | Database seeding script |