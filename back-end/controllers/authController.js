const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const user = await userModel.findOne({ email });
    // console.log(user);
    if (user) {
      if (user.role == "admin") {
        return res.status(200).json({ message: "Admin already exists" });
      } else {
        return res.status(200).json({ message: "User already exists" });
      }
    }
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      // console.log(salt);
      bcrypt.hash(password, salt, async function (err, ecryptPwd) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        const newUser = await userModel.create({
          fullname,
          email,
          password: ecryptPwd,
          role,
        });
        const token = generateToken(newUser);
        // console.log(token);
        res.cookie("token", token);
        res.status(200).json({ message: "User created successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: 401, message: "User does not exist" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res
          .status(401)
          .json({ status: 401, message: "Something went wrong" });
      }
      // console.log(result);
      if (!result) {
        return res
          .status(400)
          .json({ status: 401, message: "Invalid email or password" });
      }
      const token = generateToken(user);
      // res.cookie("token", token);
      res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        token: token,
        user: user,
        role: user.role,
      });
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};

// const logoutUser = async (req, res) => {
//   try {
//     res.cookie("token", "", {
//       expires: new Date(Date.now()),
//     });
//     res
//       .status(200)
//       .json({ status: 200, message: "User logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ status: 500, message: "Something went wrong" });
//   }
// };

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
// module.exports.logoutUser = logoutUser;
