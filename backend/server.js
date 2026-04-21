const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/easybuy")
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("EasyBuy backend is running!");
});

// 获取所有商品
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 获取购物车
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// 加入购物车（Create）
app.post("/cart", async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingCartItem = await Cart.findOne({ productId });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return res.json(existingCartItem);
    }

    const newCartItem = new Cart({
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
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// 修改购物车数量（Update）
app.put("/cart/:id", async (req, res) => {
  try {
    const { action } = req.body;
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (action === "increase") {
      cartItem.quantity += 1;
      await cartItem.save();
      return res.json(cartItem);
    }

    if (action === "decrease") {
      cartItem.quantity -= 1;

      if (cartItem.quantity <= 0) {
        await Cart.findByIdAndDelete(req.params.id);
        return res.json({ message: "Cart item removed" });
      }

      await cartItem.save();
      return res.json(cartItem);
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// 删除购物车商品（Delete）
app.delete("/cart/:id", async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});