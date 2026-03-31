const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send("You are not logged in");
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      console.log(decodedToken);
      const user = await userModel
        .findOne({ email: decodedToken.email })
        .select("-password"); //select("-password") means not select password only take email. Here (-) defines not select
        // console.log("--------------------USER------------------");
        // console.log(user);
        // console.log("--------------------USER------------------");
      req.user = user;
      next();
    } catch (err) {
      res.status(401).send("Invalid Token");
    }
  }
};
