const Product = require("../modal/Product");
const mongoose = require("mongoose");
const mail = require("../services/sendEmail");
const fs = require("fs");
const path = require("path");

exports.createProduct = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    req.body.desc = req.user.desc;
    req.body.image = req.file.filename;
    const html = `
    you have created product <br>
    product name : ${req.body.name} <br>
    price : ${req.body.price}
    `;
    await mail(req.user.email, "Product created", html);
    const product = await Product.create(req.body);

    return res.json({
      success: true,
      data: product,
      message: "Product Created Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const regex = new RegExp(req.query.search, "i");
    const sortDirection =
      req.query.sortDirection == undefined || req.query.sortDirection == ""
        ? 1
        : Number(req.query.sortDirection);
    const sortyBy =
      req.query.sortyBy == undefined || req.query.sortyBy == ""
        ? "createdAt"
        : req.query.sortyBy;

    const product = await Product.aggregate([
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
        $lookup: {
          from: "stores",
          localField: "storeId",
          foreignField: "_id",
          as: "storeObj",
        },
      },
      { $unwind: "$storeObj" },
      {
        $project: {
          name: 1,
          price: 1,
          userId: 1,
          createdAt: 1,
          image: {
            $cond: {
              if: { $eq: ["$image", ""] },
              then: "",
              else: {
                $concat: [process.env.IMG_URL, "$image"],
              },
            },
          },
          username: "$userObj.name",
          storename: "$storeObj.name",
        },
      },
      {
        $match: {
          $and: [
            { userId: req.user._id },
            {
              $or: [{ name: regex }, { price: regex }],
            },{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }
          ],
        },
      },
      {
        // $sort: { [sortyBy]: sortObj[sortDirection] },
        $sort: { [sortyBy]: sortDirection },
      },
    ]);
    return res.json({
      success: true,
      data: product,
      message: "Product Retrived Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    // const product = await Product.findOne({_id:req.params.id})
    const product = await Product.aggregate([
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
          price: 1,
          userId: 1,
          username: "$userObj.name",
          image: {
            $cond: {
              if: { $eq: ["$image", ""] },
              then: "",
              else: {
                $concat: [process.env.IMG_URL, "$image"],
              },
            },
          },
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
    ]);
    return res.json({
      success: true,
      data: product[0],
      message: "Product Retrived Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    req.body.image = req.file.filename;
    const product = await Product.updateOne(
      { _id: req.body.id },
      { $set: req.body }
    );
    return res.json({
      success: true,
      message: "Product Retrived Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.deleteOne({ _id: req.params.id });
    return res.json({
      success: true,
      message: "Product Deleted Successfully !",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
