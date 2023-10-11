const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  otp: {
    required: true,
    type: Number,
  },

  created_at: {
    required: true,
    type: Date,
    default: Date.now,
  },

  expires_at: {
    required: true,
    type: Date,
  },
});

const detailsSchema = mongoose.Schema({
  username: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
  },
  phone: {
    required: true,
    type: String,
    trim: true,
  },
});

const otpSchemaPhone = mongoose.Schema({
  otp: {
    required: true,
    type: Number,
  },

  created_at: {
    required: true,
    type: Date,
    default: Date.now,
  },

  expires_at: {
    required: true,
    type: Date,
  },
});

const forgotpwrdSchema = mongoose.Schema({
  otp: {
    required: true,
    type: Number,
  },

  created_at: {
    required: true,
    type: Date,
    default: Date.now,
  },

  expires_at: {
    required: true,
    type: Date,
  },
});

const otpVerified = mongoose.Schema({
  isverified: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const otpVerifiedPhone = mongoose.Schema({
  isverifiedPhone: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const forgotpwrdVerified = mongoose.Schema({
  isverifiedforgotpassword: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const userDetailsSchema = mongoose.Schema({
  fullname: {
    required: true,
    type: String,
  },
  gender: {
    required: true,
    type: String,
  },
  dob: {
    required: true,
    type: String,
  },
});

const userSchema = mongoose.Schema({
  username: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return value.match(re);
      },
      message: "Please enter valid email",
    },
  },
  phone: {
    required: true,
    type: String,
    trim: true,
  },
  password: {
    required: true,
    type: String,
    trim: true,
  },
  friendRequests: {
    required: false,
    type: Array,
  },
  friends: {
    required: false,
    type: Array,
  },
  follows: {
    required: false,
    type: Array,
  },
  otpSchema: {
    required: false,
    type: otpSchema,
  },
  otpVerified: {
    required: false,
    type: otpVerified,
  },
  otpSchemaPhone: {
    required: false,
    type: otpSchemaPhone,
  },
  otpVerifiedPhone: {
    required: false,
    type: otpVerifiedPhone,
  },
  forgotpwrdSchema: {
    required: false,
    type: forgotpwrdSchema,
  },
  forgotpwrdVerified: {
    required: false,
    type: forgotpwrdVerified,
  },
  userDetailsSchema: {
    required: false,
    type: userDetailsSchema,
  },
  detailsSchemaa: {
    required: false,
    type: detailsSchema,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
