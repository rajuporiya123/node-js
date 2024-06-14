const Product = require("../modal/Product");

const mongoose = require("mongoose");

exports.customerProduct = async (req, res) => {
  try {
    // const getCustomerProduct = await Product.find()
    const getCustomerProduct = await Product.aggregate([{
      $project: {
        name: 1,
        price: 1,
        userId: 1,
        image:{
            $cond: {
                if: { $eq: ["$image", ""] },
                then: "",
                else: {
                  $concat: [process.env.IMG_URL, "$image"],
                },
              }
        }
      },
    }]);
    return res.json({
      success: true,
      data: getCustomerProduct,
      message: "Get Customer Product Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
