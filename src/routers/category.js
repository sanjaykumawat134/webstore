const express = require("express");
const auth = require("../middleware/auth");
const Category = require("../models/Category");
const categoryRoutes = new express.Router();

// routes for category
//create category
categoryRoutes.post("/add", auth, async (req, res) => {
  try {
    const title = req.body.title.toLowerCase();
    const categoryAlreadyExist = await Category.findOne({ title });
    if (categoryAlreadyExist !== null) {
      return res.status(400).send({ error: "Cateogry already exist..!" });
    }
    const category = await new Category(req.body).save();
    res.status(201).send({ category });
  } catch (error) {
    res.status(400).send({ error });
  }
});

//get all product types
categoryRoutes.get("/all", async (req, res) => {
  try {
    const allCategories = await Category.find({});
    res.status(200).send(allCategories);
  } catch (error) {
    res.send(500).send({ error });
  }
});
//
module.exports = categoryRoutes;
