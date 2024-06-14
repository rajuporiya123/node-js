const mongoose = require("mongoose");

const order = new mongoose.Schema(
  {
    customerName: String,
    email: {
      type:String,
      unique: true,
    },
    address: String,
    status: {
      type: String,
      enum: ["Complated", "Pending"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order",order)