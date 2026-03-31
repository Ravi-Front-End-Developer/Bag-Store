const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
        _id: false,
      },
    ],
    orders: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    contact: Number,
    picture: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
