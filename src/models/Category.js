const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "title",
});

// categorySchema.set("toObject", { virtuals: true });
// categorySchema.set("toJSON", { virtuals: true });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
