// main file
const express = require("express");
const userRoutes = require("./routers/users");
const categoryRoutes = require("./routers/category");
const productRoutes = require("./routers/products");
require("./db/mongoose");
const app = express();
//features to user (ie routings)
app.use(express.json());
app.use("/users", userRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productRoutes);
module.exports = app;
