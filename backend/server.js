const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/easybuy")
  .then(async () => {
    console.log("MongoDB connected ✅");
    await createDefaultAdmin();
  })
  .catch((error) => console.error("MongoDB connection error:", error));

async function createDefaultAdmin() {
  const admin = await User.findOne({ username: "admin" });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Default admin created ✅");
  }
}

app.get("/", (req, res) => {
  res.send("EasyBuy backend is running!");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/cart", async (req, res) => {
  try {
    const { userId } = req.query;
    const cartItems = await Cart.find({ userId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.post("/cart", async (req, res) => {
  try {
    const { productId, userId, username } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingItem = await Cart.findOne({ productId, userId });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.json(existingItem);
    }

    const newCartItem = new Cart({
      userId,
      username,
      productId: product._id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      quantity: 1
    });

    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

app.put("/cart/:id", async (req, res) => {
  try {
    const { action } = req.body;
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (action === "increase") {
      cartItem.quantity += 1;
    }

    if (action === "decrease") {
      cartItem.quantity -= 1;

      if (cartItem.quantity <= 0) {
        await Cart.findByIdAndDelete(req.params.id);
        return res.json({ message: "Cart item removed" });
      }
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: "user"
    });

    await newUser.save();

    res.json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ error: "Register failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.json({
      message: "Login success",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/admin/carts", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all carts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});