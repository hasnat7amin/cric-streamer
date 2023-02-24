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
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.EMAIL, // TODO: your gmail account
    pass: process.env.PASSWORD, // TODO: your gmail password
  },
});

// signup controller
// /api/user/signup
module.exports.signUp = async (req, res) => {
  try {
    if(!req.body.name || !req.body.email || !req.body.password){
      return res.status(400).json({
        status: false,
        message: "User Name Email and Password are required"
      })
    }
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
    // await OTP.findOne({
    //   userId: userId,
    //   otp: otp,
    // })
    //   .then(async (otp) => {
    //     if (!otp)
    //       return res.status(400).json({
    //         status: false,
    //         message: "OTP is incorrect",
    //       });
    //     await User.findByIdAndUpdate(userId, { verified: true })
    //       .then(async (user) => {
    //         res.status(200).json({
    //           status: true,
    //           data: await User.findById(userId),
    //           message: "User verified successfully",
    //         });
    //       })
    //       .catch((err) => {
    //         res.status(400).json({
    //           status: false,
    //           message: err,
    //         });
    //       });
    //   })
    //   .catch((err) => {
    //     res.status(400).json({
    //       status: false,
    //       message: err,
    //     });
    //   });
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
    if(!req.body.email || !req.body.password){
      return res.status(400).json({
        status: false,
        message: "User Email and Password are required"
      })
    }
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
            userId: req.body.id,
          });
          otp
            .save()
            .then(async (response) => {
              let mailOptions = {
                from: process.env.EMAIL, // TODO: email sender
                to: user.email, // TODO: email receiver
                subject: "Your OTP",
                text: `Hi ${user.name}, \n Welcome to Cric Streamer! \n Your OTP is ${randomNumber}`,
              };
              await transporter.verify().then(console.log).catch(console.error);
              await transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                  // window.location = 'x';
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
    if(!req.body.userId || !req.body.password){
      return res.status(400).json({
        status: false,
        message: "User Id and Password are required"
      })
    }
    const userId = req.body.userId;
    const password = req.body.password;
    const genPassword = await bcrypt.hash(password, 10);
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

// create the controller for verify email
// /api/user/verifyEmail
module.exports.verifyEmail = async (req, res) => {
  try {
    if(!req.body.email){
      return res.status(400).json({
        status: false,
        message: "Email is required"
      })
    }
    const email = req.body.email;
    await User.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          res.status(200).json({
            status: true,
            data: user,
            message: "Email Verify successfully ",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Email does not exist",
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

// create the controller for reset password
// /api/user/resetPassword
module.exports.resetPassword = async (req, res) => {
  try {
    if(!req.body.email || !req.body.password){
      return res.status(400).json({
        status: false,
        message: "Email and Password are required"
      })
    }
    const email = req.body.email;
    const password = req.body.password;
    const genPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email: email }, { password: genPassword })
      .then(async (user) => {
        if (user) {
          res.status(200).json({
            status: true, 
            data: user,
            message: "Email Verify successfully ",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Email does not match!",
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
