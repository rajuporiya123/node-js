const User = require("../modal/User.js");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const mail = require("../services/sendEmail");

const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already Exist" });
    }

    req.body.password = await bcrypt.hashSync(req.body.password);
    const otp = randomstring.generate({
      length: 4,
      charset: "numeric",
    });
    const html = `
        Below is your one time password <br>
        Get Otp : ${otp} <br>
        `;
    req.body.otp = otp;
    
    const user = await User.create(req.body);
    await mail(req.body.email, "Signup", html);
    return res.status(201).json({
      success: true,
      data: user,
      message: "User Register Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifiedOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    } else {
      user.isEmailVerified = true;
      user.save();
      return res.status(200).json({
        success: true,
        message: "Otp verified Successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.resendotp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const otp = randomstring.generate({
      length: 4,
      charset: "numeric",
    });

    const html = `
        Below is your one time password <br>
        Get Otp : ${otp} <br>
        `;
    user.otp = otp;
    user.save();
    await mail(email, "New Otp", html);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.forgetpassword = async (req, res) => {
  try {
    const checkEmail = await User.findOne({ email: req.body.email });
    if (!checkEmail) {
      return res.status(400).json({
        success: false,
        message: "You do not registered. Please signup first",
      });
    }
    if (checkEmail) {
      let check_link = randomstring.generate();
      const html = `
        below is your forgot password link please follow <br>
        Link : ${process.env.CLIENT_URL}/reset-password/${check_link} <br>
        `;
      checkEmail.randomstring = check_link;
      checkEmail.save();
      await mail(req.body.email, "Forgot Password", html);
      return res.status(200).json({
        success: true,
        message: "Email has been sent, kindly Follow the instruction",
      });
    } else {
      return res.status(400).json({
        message: "User email does not exists",
        success: false,
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      randomstring: resetToken,
    });
    if (user) {
      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Something went wrong. Try later",
          });
        } else {
          user.password = hash;
          user.randomstring = "";
          await user.save();
          return res.status(200).json({
            success: true,
            message: "Password reset successfully",
          });
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Link Expire. Please try again with forgot password",
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong. Try later" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await User.findOne({ email: req.body.email });
    console.log('checkEmail',checkEmail);
    if (!checkEmail) {
      return res.status(400).json({
        success: false,
        message: "we can not find your account",
      });
    }
    if (!bcrypt.compareSync(password, checkEmail.password)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    } else {
      const token = jwt.sign(
        {
          id: checkEmail._id,
        },
        process.env.JWTSECRET,
        {
          expiresIn: 86400, // 1 day
        }
      );
      let result = {
        token: token,
        email: checkEmail.email,
      };
      return res.status(201).json({
        success: true,
        data: result,
        message: "Login successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
