const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const Product = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("Please select an image");
  }

  try {
    const url = req.protocol + "://" + req.get("host");
    const { name, price, discountPrice, category, description } = req.body;

    const product = new Product({
      name: name,
      price: price,
      discount: discountPrice,
      image: url + "/images/" + req.file.filename,
      category: category,
      description: description,
    });
    product.save();
    res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res, next) => {
  // console.log("--------------------BODY------------------");
  // console.log(req.body);
  // console.log("--------------------BODY------------------");
  console.log("--------------------FILE------------------");
  console.log(req.file);
  console.log("--------------------FILE------------------");

  // if (!req.body.prodCurrentId && !req.file) {
  // if (req.body.editMode === "false") {
  //   if (!req.file) {
  //     return res
  //       .status(400)
  //       .json({ status: 210, message: "Please select an image" });
  //   }
  // }

  try {
    const url = req.protocol + "://" + req.get("host");
    const { name, price, discountPrice, category, description } = req.body;

    const product = await productModel.findById(req.params.id);
    console.log(product);
    product.name = name;
    product.price = price;
    product.discount = discountPrice;
    product.image = !req.body.prodCurrentId
      ? url + "/images/" + req.file.filename
      : product.image;
    product.category = category;
    product.description = description;
    if (req.body.editMode === "true") {
      if (!req.file) {
        product.image = product.image;
      } else {
        product.image = url + "/images/" + req.file.filename;
      }
    } else {
      product.image = url + "/images/" + req.file.filename;
    }

    console.log("--------------------PRODUCT------------------");
    console.log(product);
    console.log("--------------------PRODUCT------------------");
    product.save();
    res
      .status(200)
      .json({ status: 200, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    // console.log("--------------------PRODUCT------------------");
    // console.log(product);
    // console.log("--------------------PRODUCT------------------");
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
