const express = require("express")
const {protect,admin} = require('../midleware/tokencheck')
const {createOrder,getOrder,updateOrder} = require('../controller/ordercontroller')
const router = express.Router()

router.post('/',createOrder)
router.get('/',protect, getOrder)
router.patch('/',protect,updateOrder)

module.exports = router;