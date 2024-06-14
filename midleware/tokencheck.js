const jwt = require("jsonwebtoken");
const User = require("../modal/User");

const protect = async (req,res,next) =>{
  try {
    if (
      req.headers.authorization == undefined ||
      req.headers.authorization == "undefined"
    ) {
      return res.json({ success: false, message: "Please Add Token" });
    }
    const decode = await jwt.verify(
      req.headers.authorization,
      process.env.JWTSECRET
    );
    req.user = await User.findById(decode.id).select('-password')
    next();
  } catch (error) {
    console.log("token invalid error", error);
    return res.json({ success: false, message: "token invalid" });
  }
}

// Admin middleware
const admin = (req, res, next) => {
  if(req.user && req.user.isAdmin) {
      next();
  }else{
    console.log("Not authorized as admin", error);
    return res.json({ success: false, message: "Not authorized as admin" });
  }
}

module.exports = { protect, admin }