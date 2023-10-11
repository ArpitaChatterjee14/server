const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  startdate: {
    required: true,
    type: String,
  },

  enddate: {
    required: true,
    type: String,
  },

  starttime: {
    required: true,
    type: String,
  },

  endtime: {
    required: true,
    type: String,
  },

  title: {
    required: true,
    type: String,
  },

  priority: {
    required: true,
    type: String,
    default: "Low",
  },

  color: {
    required: true,
    type: String,
    default: "Color(0xFF9296FF)",
  },

  visibility: {
    required: true,
    type: String,
    default: "Private",
  },

  description: {
    required: true,
    type: String,
    default: "NA",
  },

  participants: {
    required: true,
    type: Array,
  },

  notify: {
    required: true,
    type: String,
    default: "In app notification",
  },
});

const Booking = mongoose.model("BookingSchema", BookingSchema);

module.exports = Booking;
