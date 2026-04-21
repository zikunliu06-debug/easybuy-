const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/easybuy")
  .then(async () => {
    console.log("MongoDB connected for seeding");

    await Product.deleteMany({});

    await Product.insertMany([
      {
        name: "White T-Shirt",
        price: 19.99,
        category: "Fashion",
        image: "image/tshirt.png"
      },
      {
        name: "Headphones",
        price: 59.99,
        category: "Electronics",
        image: "image/headphone.webp"
      },
      {
        name: "Desk Lamp",
        price: 29.99,
        category: "Home",
        image: "image/desk-lamp.jpeg"
      },
      {
        name: "Face Cream",
        price: 24.99,
        category: "Beauty",
        image: "image/face-cream.jpeg"
      },
      {
        name: "Blue Jeans",
        price: 45.99,
        category: "Fashion",
        image: "image/blue-jeans.webp"
      },
      {
        name: "Coffee Mug",
        price: 12.99,
        category: "Home",
        image: "image/mug.webp"
      }
    ]);

    console.log("Products seeded successfully ✅");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Seeding error:", error);
  });