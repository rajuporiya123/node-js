const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const product = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image:String,
    desc: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    storeId :{
      type :mongoose.Schema.Types.ObjectId,
      ref:'Store'
    }
  },
  {
    timestamps: true,
  }
);
product.plugin(aggregatePaginate)
module.exports = mongoose.model("Product", product);
