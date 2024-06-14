const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    username: {
      type: String,
      default: "",
    },
    resetToken: {
      type: String,
      default: "",
    },
    randomstring: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
    },
    otpExpiration: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin:{
      type:Boolean,
      default:false
    },
    resetTokenExpiration: Date,
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", user);
