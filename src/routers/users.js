const express = require("express");
const userRoutes = new express.Router();
const User = require("../models/User");
// default welcome
userRoutes.get("/", (req, res) => {
  res.json("Hello world ! welcome").send();
});

//user register
userRoutes.post("/register", async (req, res) => {
  try {
    const user = await new User(req.body).save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.send(400).send();
  }
});
//login processing route
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredientials(email, password);
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(404).send({ error });
  }
});

// //category
// userRoutes.post('/category', (req, res) => {

// })

module.exports = userRoutes;
