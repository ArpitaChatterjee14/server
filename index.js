const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const bookingRouter = require("./routes/booking");
const userDetailsRouter = require("./routes/userdetails");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(authRouter, bookingRouter, userDetailsRouter);

const DB =
  "mongodb+srv://arpita:14Arpita94@cluster0.9odburv.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => console.log(e));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
