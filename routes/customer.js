const express = require("express")
const { customerProduct } = require("../controller/cutomercontroller")

const router = express.Router()

router.get('/getproducts',customerProduct)

module.exports = router