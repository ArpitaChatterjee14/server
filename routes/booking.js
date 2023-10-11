const express = require("express");
const bookingRouter = express.Router();
const Booking = require("../models/booking");

bookingRouter.post("/api/quickbooking", async (req, res) => {
  try {
    const { startdate, enddate, starttime, endtime, title, participants } =
      req.body;

    let booking = new Booking({
      startdate,
      enddate,
      starttime,
      endtime,
      title,
      participants,
    });
    booking = await booking.save();
    res.status(200).json(booking);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

bookingRouter.post("/api/showbooking", async (req, res) => {
  try {
    const { startdate, participant } = req.body;

    const existing = await Booking.find({
      startdate,
      participants: participant,
    });

    if (!existing) {
      return res.status(404).json({ msg: "No events found" });
    }

    res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

bookingRouter.post("/api/usualbooking", async (req, res) => {
  try {
    const {
      startdate,
      enddate,
      starttime,
      endtime,
      title,
      description,
      visibility,
      participants,
      priority,
      notify,
      color,
    } = req.body;

    let booking = new Booking({
      startdate,
      enddate,
      starttime,
      endtime,
      title,
      description,
      visibility,
      participants,
      priority,
      notify,
      color,
    });
    booking = await booking.save();
    res.status(200).json(booking);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

bookingRouter.post("/api/bookingnotify", async (req, res) => {
  try {
    const { participant } = req.body;

    const existing = await Booking.find(
      {
        participants: participant,
      },
      { title: 1, participants: 1 }
    );

    if (!existing) {
      return res.status(404).json({ msg: "No events found" });
    }

    return res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

bookingRouter.post("/api/bookingusername", async (req, res) => {
  try {
    const { participant, startdate } = req.body;

    const existing = await Booking.aggregate([
      [
        {
          $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "email",
            as: "result",
          },
        },
        {
          $match: {
            participants: participant,
            startdate: startdate,
          },
        },
        {
          $project: {
            "result.username": 1,
          },
        },
      ],
    ]);

    if (!existing) {
      return res.status(404).json({ msg: "No events found" });
    }

    return res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

bookingRouter.post("/api/bookingconfig", async (req, res) => {
  try {
    const { participant } = req.body;

    const existing = await Booking.aggregate([
      {
        $match: {
          participants: participant,
        },
      },
      {
        $group: {
          _id: "$startdate",
          books: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          "books.color": 1,
          "books.starttime": 1,
          "books.endtime": 1,
        },
      },
    ]);

    if (!existing) {
      return res.status(404).json({ msg: "No events found" });
    }

    return res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = bookingRouter;
