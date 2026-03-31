const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  bill: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("cart", cartSchema);