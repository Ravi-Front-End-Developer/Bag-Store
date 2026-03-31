const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const express = require("express");

const app = express();

app.use("/images", express.static(path.join(__dirname, "./public/images")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
