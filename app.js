require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
require("./config/connection");
const mongoose = require("mongoose");
mongoose.set("debug", true);
const cors = require("cors");

app.use(cors());
app.use('/raju',(req,res,next)=>{
res.send("Hello from server")
})

app.use(express.json({ limit: "150mb" }));
app.use(express.static(path.join(__dirname, "uploads")));

const userRouter = require("./routes/users");
const productRouter = require("./routes/product");
const storeRouter = require("./routes/storeRouter");
const orderRouter = require("./routes/order");
const customerRouter = require("./routes/customer");

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/store", storeRouter);
app.use("/order", orderRouter);
app.use("/customer", customerRouter);

app.listen(process.env.PORT, () => {
  console.log("app is running on ", process.env.PORT);
});
