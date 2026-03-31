const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    console.log("--------------------USER------------------");
    console.log(user);
    console.log("--------------------USER------------------");
    if (!user) {
      res.status(401).send({ status: 401, message: "Admin does not exist"});
    } else if (req.user.role !== "admin") {
      res.status(401).send({ status: 401, message: "You are not authorized"});
    } else {
      next();
    }
  } catch (err) {
    res.status(401).send({ status: 401, message: "Invalid Token"});
  }
};
