const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    unitsInStocks: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    likes: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dislikes: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    allLikes: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Negative votes not allowed");
        }
      },
    },
    comments: [
      {
        text: {
          type: String,
        },
        postedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
