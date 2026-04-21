EasyBuy – E-commerce Shopping Website
📌 Project Overview

EasyBuy is a single-page e-commerce web application that allows users to browse products, search items, and manage a shopping cart. The application demonstrates full CRUD operations using a MongoDB database.

🎯 Problem Statement

Many simple shopping websites lack persistent data storage and interactive user experiences. This project aims to build a responsive and dynamic shopping platform where users can interact with products and manage their cart efficiently.

🛠️ Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
✨ Features
View all products from database
Search products by name
Filter products by category
Add items to shopping cart
Increase / decrease quantity
Remove items from cart
Persistent cart stored in database
🔄 CRUD Operations
Operation	Feature
Create	Add product to cart
Read	View products & cart
Update	Change quantity
Delete	Remove item from cart
📁 Project Structure
backend/
  models/
    Product.js
    Cart.js
  server.js

frontend/
  index.html
  script.js
  style.css
⚠️ Challenges Faced
Connecting frontend and backend APIs
Fixing MongoDB connection issues (IP whitelist & SRV error)
Migrating cart from localStorage to database
Handling async API calls correctly
🚀 How to Run the Project
Start MongoDB
Run backend:
node server.js
Open frontend with Live Server