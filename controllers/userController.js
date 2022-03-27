const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const axios = require("axios");
const User = require("../models/User");
const OTP = require("../models/OTP");
const _ = require("lodash");
var messagebird = require("messagebird")(process.env.MESSAGE_API_KEY);
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // TODO: your gmail account
    pass: process.env.PASSWORD, // TODO: your gmail password
  },
});

// signup controller
// /api/user/signup
module.exports.signUp = async (req, res) => {
  try {
    User.findOne({
      email: req.body.email,
    })
      .then(async (user) => {
        if (user)
          return res.status(400).json({
            status: false,
            message: "User already exists",
          });
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const genPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: genPassword,
          phoneNo: req.body.phoneNo,
          verified: false,
        });
        newUser
          .save()
          .then((result) => {
            res.status(200).json({
              status: true,
              data: result,
              message: "user signed in successfully",
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: false,
              message: err,
            });
          });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// verify controller
// /api/user/signup/verify
module.exports.verifyOTP = async (req, res) => {
  try {
    const userId = req.body.userId;
    const otp = req.body.otp;

    await OTP.findOne({
      userId: userId,
      otp: otp,
    })
      .then(async (otp) => {
        if (!otp)
          return res.status(400).json({
            status: false,
            message: "OTP is incorrect",
          });
        await User.findByIdAndUpdate(userId, { verified: true })
          .then(async (user) => {
            res.status(200).json({
              status: true,
              data: await User.findById(userId),
              message: "User verified successfully",
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: false,
              message: err,
            });
          });
      })
      .catch((err) => {
        res.status(400).json({
          status: false,
          message: err,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// login controller
// /api/user/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    await User.findOne({
      email: email,
    })
      .then(async (user) => {
        if (!user)
          return res.status(400).json({
            status: false,
            message: "User does not exist",
          });
        if (!user.verified)
          return res.status(400).json({
            status: false,
            message: "User is not verified",
          });
        //console.log(user);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            status: false,
            message: "Password is incorrect",
          });
        const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET);
        res.header("auth-token", token).json({
          status: true,
          token: token,
          message: "user logged in successfully",
        });
        //res.status(200).send(user);
      })
      .catch((err) => {
        res.status(400).json({
          status: false,
          message: err,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// delete controller
// /api/user/deleteALL
module.exports.deleteAll = async (req, res) => {
  try {
    await User.deleteMany({})
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// send OTP controller
// /api/user/sendOTP
module.exports.sendOTP = async (req, res) => {
  try {
    User.findOne({
      email: req.body.email,
    })
      .then(async (user) => {
        if (user) {
          const randomNumber = Math.floor(100000 + Math.random() * 900000);

          const otp = new OTP({
            otp: randomNumber,
            userId: user._id,
          });
          otp
            .save()
            .then((response) => {
              let mailOptions = {
                from: "hasnatamin708@gmail.com", // TODO: email sender
                to: user.email, // TODO: email receiver
                subject: "Your OTP",
                text: `Hi ${user.name}, \n Welcome to Cric Streamer! \n Your OTP is ${randomNumber}`,
              };
              transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                  // window.location = 'https://accounts.google.com/b/0/DisplayUnlockCaptcha';
                  return res.status(400).json({
                    status: false,
                    message: err,
                  });
                }

                return res.status(200).json({
                  status: true,
                  data: user,
                  message: "OTP sent successfully",
                });
              });
            })
            .catch((err) => {
              res.status(400).json({
                status: false,
                message: err,
              });
            });
        }
      })
      .catch((err) => {
        res.status(400).json({
          status: false,
          message: err,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// changePassword controller
// /api/user/changePassword
module.exports.changePassword = async (req, res) => {
  try {
    const userId = req.body.userId;
    const password = req.body.password;
    const genPassword = await bcrypt.hash(req.body.password, 10);
    await User.findByIdAndUpdate(userId, { password: genPassword })
      .then(async (user) => {
        res.status(200).json({
          status: true,
          data: await User.findById(userId),
          message: "Password changed successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: false,
          message: err,
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};
