//middleware for auth
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async function (req, res, next) {
  // console.log("middleware called");
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error("user not found !");
    }
    req.user = user; // add user to request
    req.token = token; // add token to request
    next();
  } catch (error) {
    res.status(404).send({ error: "please authenticate!" });
  }
};

module.exports = auth;
