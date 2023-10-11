const mongoose = require("mongoose");

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

const Details = mongoose.model("Details", detailsSchema);

module.exports = Details;
