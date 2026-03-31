const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const cartModel = require("../models/cart-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    // 1. Find the user
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    // 2. 'populate' replace the productId strings with full Product objects
    const userWithCart = await userModel
      .findById(req.user._id)
      .populate("cart.productId");
    res.status(200).json(userWithCart.cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

router.post("/addToCart/:productId", isLoggedIn, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const itemIndex = req.user.cart.findIndex(
      (item) => item.productId == productId,
    );
    if (itemIndex > -1) {
      if (req.user.cart[itemIndex].quantity === 1) {
        return res.status(200).json({ message: "Item already exists in cart" });
      }
    //   req.user.cart[itemIndex].quantity += 1;
    //   await req.user.save();
    //   res
    //     .status(200)
    //     .json({ message: "Item added to cart successfully", user: req.user });
    } else {
      const cart = new cartModel({
        user: req.user._id,
        items: [{ productId, quantity: 1 }],
        bill: 0,
      });
      req.user.cart.push({ productId, quantity: 1 });
      await req.user.save();
      res
        .status(200)
        .json({ message: "Item added to cart successfully", user: req.user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updateCart/:productId", isLoggedIn, async (req, res, next) => {
  try {
    // console.log("--------------------BODY------------------");
    // console.log(req.body);
    // console.log("--------------------BODY------------------");
    // console.log("--------------------PARAMS------------------");
    // console.log(req.params);
    // console.log("--------------------PARAMS------------------");
    // console.log("--------------------USER------------------");
    // console.log(req.user);
    // console.log("--------------------USER------------------");
    // const productId = req.params.productId;
    // console.log("--------------------PRODUCT ID------------------");
    // console.log(productId);
    // console.log("--------------------PRODUCT ID------------------");
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const itemIndex = req.user.cart.findIndex(
      (item) => item.productId == productId,
    );
    if (itemIndex > -1) {
      req.user.cart[itemIndex].quantity = req.body.quantity;
    }
    await req.user.save();
    res
      .status(200)
      .json({ message: "Item updated in cart successfully", user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/removeFromCart/:productId",
  isLoggedIn,
  async (req, res, next) => {
    const productId = req.params.productId;
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const itemIndex = req.user.cart.findIndex(
      (item) => item.productId == productId,
    );
    if (itemIndex > -1) {
      req.user.cart.splice(itemIndex, 1);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    await req.user.save();
    res
      .status(200)
      .json({ message: "Item removed from cart successfully", user: req.user });
  },
);

module.exports = router;
