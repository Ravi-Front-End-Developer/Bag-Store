const express = require("express");
const router = express.Router();

router.get("/admin", (req, res, next) => {
  res.send("Owners Data");
});

module.exports = router;
