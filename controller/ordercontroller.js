const Order = require("../modal/Order");
const mongoose = require("mongoose");
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return res.json({
      success: true,
      data: order,
      message: "Order Created Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productObj",
        },
      },
      { $unwind: "$productObj" },
      {
        $project: {
          customerName: 1,
          email: 1,
          address: 1,
          status: 1,
          productName: "$productObj.name",
          userId: 1,
        },
      },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
    ]);
    return res.json({
      success: true,
      data: order,
      message: "Order Get Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.updateOne(
      { _id: req.body.orderId,userId:req.user.id },
      { $set: {
        status:"Completed"
      } }
    );
    return res.json({
      success: true,
      message: "Order Update Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};
