const Store = require("../modal/Store");
const mongoose = require("mongoose");
exports.createStore = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const product = await Store.create(req.body);
    return res.json({
      success: true,
      data: product,
      message: "Product Created Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getStore = async (req, res) => {
  try {
    const product = await Store.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userObj",
        },
      },
      { $unwind: "$userObj" },
      {
        $project: {
          name: 1,
          city: 1,
          userId: 1,
          createdAt: 1,
          username: "$userObj.name",
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
      data: product,
      message: "Store Get Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
