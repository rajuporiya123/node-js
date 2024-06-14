const mongoose = require("mongoose");

const shop = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    location:{
        type:String,
        default:''
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Shop", shop);
