const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  label: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
  addressLine: String,
  city: String,
  state: String,
  zipCode: Number,
  country: String,
  otherLabel: String,
  isDefault: {
    type: Boolean,
    default: false,
  }, // Helps logic for the "Main" address
});

module.exports = mongoose.model("addressInfo", addressSchema);
