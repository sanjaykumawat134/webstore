const express = require("express");
const productRoutes = new express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Category = require("../models/Category");
//create a new product
productRoutes.post("/add", auth, async (req, res) => {
  try {
    const categoryExisted = await Category.findOne({
      title: req.body.category.toLowerCase(),
    });
    if (!categoryExisted) {
      return res.status(404).send({ error: "no category found !" });
    }
    const product = await new Product({
      ...req.body,
      category: categoryExisted._id,
    }).save();
    if (!product) {
      return res.status(400).send({ error: "please authenticate !" });
    }
    res.status(201).send({ product });
  } catch (error) {
    res.status(400).send({ error });
  }
});
//get all product
productRoutes.get("/all", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).send(products);
  } catch (error) {
    res.status(400).send({ error });
  }
});
//get recent products
productRoutes.get("/recent", async (req, res) => {
  try {
    // const recent = req.query.recent;
    // recent = recent === 'true' ? true : false;
    let limit = req.query.limit;
    console.log(limit);
    if (!limit) {
      limit = 5;
    }
    const products = await Product.find({}, null, {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
    });
    res.send(products);
  } catch (error) {
    res.status(404).send();
  }
});
//update product
productRoutes.patch("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      title: req.body.category.toLowerCase(),
    });
    if (!category) {
      return res.status(404).send({ error: "No category found!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        category: category._id,
      },
      { new: true }
    );
    res.status(202).send(updatedProduct);
  } catch (error) {
    res.status(404).send(error);
  }
});
//get all product by product types
productRoutes.get("/cat", async (req, res) => {
  try {
    const category = req.query.category;
    const limit = req.query.limit;
    if (!limit) {
      limit = 5;
    }
    if (!category) {
      return res.status(400).send({ error: "please enter category!" });
    }
    const Allproducts = await Product.find({});
    const products = [];
    for (product of Allproducts) {
      const p = await product
        .populate({
          path: "category",
          options: {
            limit,
          },
        })
        .execPopulate();
      if (p.category.title === category.toLowerCase()) {
        products.push(p);
      }
    }
    if (products.length === 0) {
      return res
        .status(404)
        .send({ error: "No product found under this category" });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send({ error });
  }
});

//delete product
productRoutes.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(_id);
    if (!deletedProduct) {
      return res.status(404).send();
    }
    res.send(deletedProduct);
  } catch (error) {
    res.status(404).send(error);
  }
});
productRoutes.put("/like", auth, async (req, res) => {
  try {
    const _id = req.body.productId;

    const product = await Product.findByIdAndUpdate(
      { _id },
      {
        $inc: { allLikes: 1 },
        $push: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
    console.log(product);
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

productRoutes.put("/dislike", auth, async (req, res) => {
  try {
    const _id = req.body.productId;
    const product = await Product.findByIdAndUpdate(
      { _id },
      {
        $pull: {
          likes: req.user._id,
        },
        $push: {
          dislikes: req.user._id,
        },
        allLikes: allLikes--,
      }
    );
  } catch (error) {
    res.status(404).send(error);
  }
});

productRoutes.get("/test", async (req, res) => {
  const category = req.query.category;
  const cat = await Category.findOne({ title: category });
  const scat = await cat.populate("products");
  console.log(scat);
  console.log(scat.id);
  res.status(200).send(scat.products);
});

module.exports = productRoutes;
