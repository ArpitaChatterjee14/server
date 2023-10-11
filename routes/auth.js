const express = require("express");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const transporter = require("../nodemailer/nodemailer");
const accountSid = "ACf35f33167bb8abfc2fb2192cdef9939d";
const authToken = "13f4981a067c7f8e2d10a6c18157348d";
const client = require("twilio")(accountSid, authToken);

// Register User
authRouter.post("/api/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    user = await user.save();

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Log in User
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email or username doesn't exists" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.status(200).json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Send OTP to Email
authRouter.post("/api/verifyemail", async (req, res) => {
  function addMinutes(date, minutes) {
    date = new Date(date).setMinutes(new Date(date).getMinutes() + minutes);

    return date;
  }
  function usersubstring(user) {
    user = new user.split(".");
    return user[0];
  }
  try {
    const { email } = req.body;

    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    const existinguser = await User.findOneAndUpdate(
      { email },
      {
        otpSchema: {
          otp: OTP,
          created_at: Date.now(),
          expires_at: addMinutes(Date.now(), 20),
        },
        otpVerified: {
          isVerified: false,
        },
      },
      { new: true }
    );

    if (!existinguser) {
      return res
        .status(400)
        .json({ msg: "User with this email doesn't exists" });
    }

    let info = await transporter.sendMail({
      from: "arpitachatterjee47@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: "Email OTP Verification", // Subject line
      text: `OTP is ${OTP}`, // plain text body
      html: `<b>Hello user,</b><br>OTP is ${OTP}</br>`, // html body
    });

    res.status(200).json({ msg: "OTP Sent Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Send OTP to Phone
authRouter.post("/api/verifyphone", async (req, res) => {
  function addMinutes(date, minutes) {
    date = new Date(date).setMinutes(new Date(date).getMinutes() + minutes);

    return date;
  }
  try {
    const { phone } = req.body;

    let digits = "0123456789";

    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    const existinguser = await User.findOneAndUpdate(
      { phone },
      {
        otpSchemaPhone: {
          otp: OTP,
          created_at: Date.now(),
          expires_at: addMinutes(Date.now(), 20),
        },
        otpVerifiedPhone: {
          isVerifiedPhone: false,
        },
      },
      { new: true }
    );

    if (!existinguser) {
      return res
        .status(400)
        .json({ msg: "User with this phone number doesn't exists" });
    }

    let info = await client.messages
      .create({
        body: `OTP is ${OTP}`,
        from: "+14066254945",
        to: "+91" + `${phone}`,
      })
      .then(() => {
        res.status(200).json({ msg: "OTP sent successfully" });
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Validate Email OTP
authRouter.post("/api/verifyotpemail", async (req, res) => {
  try {
    const { email, otp } = req.body;

    let existinguser;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email doesn't exists" });
    }

    if (
      parseInt(otp) === user.otpSchema.otp &&
      new Date(user.otpSchema.expires_at) > new Date(Date.now())
    ) {
      existinguser = await User.findOneAndUpdate(
        { email },
        {
          otpVerified: {
            isverified: true,
          },
        },
        { new: true }
      );
      res.status(200).json({ existinguser });
    } else {
      if (new Date(user.otpSchema.expires_at) <= new Date(Date.now()))
        res.status(500).json({ msg: "OTP Expired" });
      else {
        res.status(500).json({ msg: "Invalid OTP" });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Validate Phone OTP
authRouter.post("/api/verifyotpphone", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    let existinguser;

    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this phone doesn't exists" });
    }

    if (
      +otp === user.otpSchemaPhone.otp &&
      new Date(user.otpSchemaPhone.expires_at) > new Date(Date.now())
    ) {
      existinguser = await User.findOneAndUpdate(
        { phone },
        {
          otpVerifiedPhone: {
            isverifiedPhone: true,
          },
        },
        { new: true }
      );
      res.status(200).json({ existinguser });
    } else {
      if (new Date(user.otpSchemaPhone.expires_at) <= new Date(Date.now()))
        res.status(500).json({ msg: "OTP Expired" });
      else res.status(500).json({ msg: "Invalid OTP" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Forgot Password
authRouter.post("/api/forgotpassword", async (req, res) => {
  function addMinutes(date, minutes) {
    date = new Date(date).setMinutes(new Date(date).getMinutes() + minutes);

    return date;
  }
  function usersubstring(user) {
    splitted = user.split(".");
    return splitted[0];
  }

  try {
    const { email } = req.body;

    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    const existinguser = await User.findOneAndUpdate(
      { email },
      {
        forgotpwrdSchema: {
          otp: OTP,
          created_at: Date.now(),
          expires_at: addMinutes(Date.now(), 20),
        },
        forgotpwrdVerified: {
          isverifiedforgotpassword: false,
        },
      },
      { new: true }
    );

    if (!existinguser) {
      return res
        .status(400)
        .json({ msg: "User with this email doesn't exists" });
    }

    let info = await transporter.sendMail({
      from: "arpitachatterjee47@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: "Email OTP Verification", // Subject line
      text: `OTP is ${OTP}`, // plain text body
      html: `<b>Hello user,</b><br>OTP is ${OTP}</br>`, // html body
    });

    res.status(200).json({ msg: "OTP Sent Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Validate Forgot Password
authRouter.post("/api/forgotpasswordvalidation", async (req, res) => {
  try {
    const { email, otp } = req.body;
    let existinguser;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email doesn't exists" });
    }

    if (
      +otp === user.forgotpwrdSchema.otp &&
      new Date(user.forgotpwrdSchema.expires_at) > new Date(Date.now())
    ) {
      existinguser = await User.findOneAndUpdate(
        { email },
        {
          forgotpwrdVerified: {
            isverifiedforgotpassword: true,
          },
        },
        { new: true }
      );
      res.status(200).json({ existinguser });
    } else {
      if (new Date(user.forgotpwrdSchema.expires_at) <= new Date(Date.now()))
        res.status(500).json({ msg: "OTP Expired" });
      else res.status(500).json({ msg: "Invalid OTP" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Reset Password
authRouter.post("/api/resetpassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    let existinguser;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email doesn't exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);

    existinguser = await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json({ existinguser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Google Auth
authRouter.post("/api/googleoauth", async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
