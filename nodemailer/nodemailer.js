const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: "arpitachatterjee47@gmail.com",
    pass: "13zSVQs8X7f4ZyrK",
  },
});

module.exports = transporter;
