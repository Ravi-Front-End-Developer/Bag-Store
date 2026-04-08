const express = require("express");
const {
  getProfile,
  saveProfileDetails,
} = require("../controllers/profile.controller");
const isLoggedIn = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");

const router = express.Router();

router.get("/", isLoggedIn, getProfile);
router.post("/savePersonalDetails", isLoggedIn, upload.single("profileImage"), saveProfileDetails);

module.exports = router;
