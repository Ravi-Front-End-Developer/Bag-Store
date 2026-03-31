const mongoose = require("mongoose");

const personalInfoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    firstName: String,
    lastName: String,
    mobileNo: String,
    profileImage: String,
    email: String,
    gender: String,

    // This points to the address the user chose as "Main"
    primaryAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addressInfo",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("personalInfo", personalInfoSchema);
