const express = require("express");
const router = express.Router();

const { createStore,getStore } = require("../controller/storecontroller");
const {protect,admin} = require("../midleware/tokencheck");

router.post("/", protect, createStore);
router.get("/", protect, getStore);

module.exports = router;
