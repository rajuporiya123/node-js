const express = require("express");
const {
  signup,
  signin,
  forgetpassword,
  resetpassword,
  verifiedOtp,
  resendotp,
} = require("../controller/usercontroller");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forget-password", forgetpassword);
router.post("/reset-password", resetpassword);
router.post("/verifiedOtp", verifiedOtp);
router.post("/resendOtp", resendotp);

module.exports = router;
