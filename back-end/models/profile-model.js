const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  // Link to the Personal Info we defined above
  personalInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "personalInfo",
  },
  // Usually, users have one default payment method
  defaultPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paymentsDetails",
  },
  //
  ordersId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ordersInfo",
  },
});

module.exports = mongoose.model("profile", profileSchema);
