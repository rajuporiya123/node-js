const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./../modal/User.js");
const Store = require("./../modal/Store.js");
const Product = require("./../modal/Product.js");

mongoose
  .connect("mongodb://0.0.0.0:27017/raju", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("DB NOT CONNECTED", err);
  });

// READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const stores = JSON.parse(fs.readFileSync(`${__dirname}/stores.json`, "utf-8"));
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users);
    await Store.create(stores);
    await Product.create(products);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log("error : ", err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Store.deleteMany();
    await Product.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log("error : ", err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
