# EasyBuy 🛍

A full-stack e-commerce shopping cart application built with React, Node.js, Express, and MongoDB. Users can browse products, manage their shopping cart, and administrators can monitor all user accounts and cart activity.

---

## Features

- **User Authentication** — Register and login with password hashing (bcrypt) and JWT-based session management
- **Live Search** — Real-time product filtering as the user types, no page reload required
- **Shopping Cart** — Add, increase, decrease, and remove items; persistent per user in MongoDB
- **Role-Based Access Control** — Regular users see the shop and their cart; admin users see a dashboard with all users and all carts
- **Single-Page Application** — Built with React; all views rendered dynamically without full page reloads

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |

---

## Project Structure

```
easybuy/
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main app component (routing, state, all views)
│   │   └── App.css         # Global styles
│   ├── index.html
│   └── package.json
│
├── backend/                # Node.js + Express API
│   ├── server.js           # Entry point, all routes defined here
│   ├── models/             # Mongoose models
│   │   ├── User.js         # User schema (username, password, role)
│   │   ├── Product.js      # Product schema (name, price, image)
│   │   └── CartItem.js     # Cart schema (userId, productId, quantity)
│   └── package.json
│
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

### 3. Start the frontend

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
| POST | `/login` | Login, returns JWT | — |
| GET | `/products` | Get all products | — |
| GET | `/cart?userId=` | Get cart items for a user | — |
| POST | `/cart` | Add item to cart | — |
| PUT | `/cart/:id` | Increase or decrease quantity | — |
| DELETE | `/cart/:id` | Remove item from cart | — |
| GET | `/admin/users` | Get all users | Admin JWT |
| GET | `/admin/carts` | Get all cart items | Admin JWT |

---

## Database

The application uses three MongoDB collections corresponding to the three CRUD entities:

- **users** — stores registered accounts with hashed passwords and roles
- **products** — stores product catalogue (pre-seeded)
- **cartitems** — stores each user's cart with product reference and quantity

A sample database export can be found in the `/backend/data/` folder (`.json` files importable with `mongoimport`).

---

## Demo Account

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin123!` |
| User | `testuser` | `Test123!` |

---

## Workload Allocation

This project was completed individually by **Zikun Liu**.

| File | Description |
|------|-------------|
| `frontend/src/App.jsx` | All React components and frontend logic |
| `frontend/src/App.css` | All styles |
| `backend/server.js` | All API routes and middleware |
| `backend/models/User.js` | User Mongoose model |
| `backend/models/Product.js` | Product Mongoose model |
| `backend/models/CartItem.js` | Cart item Mongoose model |
