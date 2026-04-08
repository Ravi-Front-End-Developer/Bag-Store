const multer = require("multer");
const path = require("path");
const express = require("express");

const app = express();

app.use("/images", express.static(path.join(__dirname, "./public/images")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("--------------------destination------------------");
    console.log(file);
    console.log("--------------------destination------------------");
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    console.log("--------------------filename------------------");
    console.log(file);
    console.log("--------------------filename------------------");
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
