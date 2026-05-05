const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  username: String,
  productId: String,
  name: String,
  price: Number,
  category: String,
  image: String,
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Cart", cartSchema);