const express = require("express");
const userDetailsRouter = express.Router();
const UserDetails = require("../models/user");

userDetailsRouter.post("/api/userdetails", async (req, res) => {
  try {
    const { username } = req.body;

    const existingusername = await UserDetails.find(
      {
        username,
      },
      { email: 1, username: 1, phone: 1 }
    );

    if (!existingusername) {
      return;
    }

    res.status(200).json(existingusername);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/frienddetails", async (req, res) => {
  try {
    const { email } = req.body;

    const existingusername = await UserDetails.find(
      {
        email,
      },
      { email: 1, username: 1, phone: 1 }
    );

    if (!existingusername) {
      return;
    }

    res.status(200).json(existingusername);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userDetailsRouter.post("/api/allfriends", async (req, res) => {
  try {
    const { email } = req.body;

    [
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "email",
          as: "result",
        },
      },
      {
        $match: {
          email: email,
        },
      },
      {
        $project: {
          "result.username": 1,
          "result.email": 1,
        },
      },
    ];

    if (!existingusername) {
      return;
    }

    res.status(200).json(existingusername);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//
userDetailsRouter.post("/api/addfriend", async (req, res) => {
  try {
    const { email, friend } = req.body;

    const duplicate = await UserDetails.find({
      email: email,
      friendRequests: friend,
    });

    if (duplicate.length > 0) {
      return res.status(400).json(duplicate);
    }

    if (duplicate.length == 0) {
      const existing = await UserDetails.findOneAndUpdate(
        {
          email,
        },
        { $push: { friendRequests: friend } },
        { new: true }
      );

      if (!existing) {
        return;
      }

      return res.status(200).json(existing);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/addfriendnotify", async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await UserDetails.find(
      {
        email,
      },
      { friendRequests: 1 }
    );

    if (!existing) {
      return;
    }

    res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/confirmfriend", async (req, res) => {
  try {
    const { email, friend } = req.body;
    const duplicate = await UserDetails.find({
      email: email,

      friends: friend,
    });

    if (duplicate.length > 0) {
      return res.status(400).json(duplicate);
    }

    if (duplicate.length == 0) {
      const existing = await UserDetails.findOneAndUpdate(
        {
          email,
        },
        { $push: { friends: friend } },
        { new: true }
      );

      if (!existing) {
        return;
      }

      return res.status(200).json(existing);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/allfriend", async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await UserDetails.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "email",
          as: "frienddetails",
        },
      },
      {
        $match: {
          email: email,
        },
      },
      {
        $project: {
          "frienddetails.username": 1,
          "frienddetails.email": 1,
        },
      },
    ]);

    if (!existing) {
      return;
    }

    res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/allfollow", async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await UserDetails.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "follows",
          foreignField: "email",
          as: "followdetails",
        },
      },
      {
        $match: {
          email: email,
        },
      },
      {
        $project: {
          "followdetails.username": 1,
          "followdetails.email": 1,
        },
      },
    ]);

    if (!existing) {
      return;
    }

    res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.get("/api/all", async (req, res) => {
  try {
    const existingusername = await UserDetails.find(
      {},
      { email: 1, username: 1, phone: 1 }
    );

    if (!existingusername) {
      return;
    }

    res.status(200).json(existingusername);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/removefriendrequest", async (req, res) => {
  try {
    const { email, friend } = req.body;
    const existing = await UserDetails.findOneAndUpdate(
      {
        email,
      },
      { $pull: { friendRequests: friend } },
      { new: true }
    );

    if (!existing) {
      return;
    }

    return res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/addfollow", async (req, res) => {
  try {
    const { email, friend } = req.body;

    const duplicate = await UserDetails.find({
      email: email,
      follows: friend,
    });

    if (duplicate.length > 0) {
      return res.status(400).json({ duplicate });
    }

    if (duplicate.length == 0) {
      const existing = await UserDetails.findOneAndUpdate(
        {
          email,
        },
        { $push: { follows: friend } },
        { new: true }
      );

      if (!existing) {
        return;
      }

      return res.status(200).json(existing);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/removefollow", async (req, res) => {
  try {
    const { email, friend } = req.body;
    const existing = await UserDetails.findOneAndUpdate(
      {
        email,
      },
      { $pull: { follows: friend } },
      { new: true }
    );

    if (!existing) {
      return;
    }

    return res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//
userDetailsRouter.post("/api/removefriend", async (req, res) => {
  try {
    const { email, friend } = req.body;
    const existing = await UserDetails.findOneAndUpdate(
      {
        email,
      },
      { $pull: { friends: friend } },
      { new: true }
    );

    if (!existing) {
      return;
    }

    return res.status(200).json(existing);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userDetailsRouter.post("/api/checkstatus", async (req, res) => {
  try {
    const { email, friend } = req.body;

    const friends = await UserDetails.find({ email, friends: friend });

    const frien = await UserDetails.find({ email: friend, friends: email });

    const follows = await UserDetails.find({ email, follows: friend });

    const requests = await UserDetails.find({ email, friendRequests: friend });

    const request = await UserDetails.find({
      email: friend,
      friendRequests: email,
    });

    if (
      friends.length == 0 &&
      frien.length == 0 &&
      request.length == 0 &&
      requests.length == 0
    ) {
      if (follows.length > 0) {
        return res.status(200).json({ msg: "UnFollow & Add Friend" });
      }
      return res.status(200).json({ msg: "Follow & Add Friend" });
    }

    if (friends.length == 0 && frien.length == 0 && request.length > 0) {
      if (follows.length > 0) {
        return res.status(200).json({ msg: "UnFollow & Cancel" });
      }
      return res.status(200).json({ msg: "Follow & Cancel" });
    }

    if (friends.length == 0 && requests.length > 0) {
      if (follows.length > 0) {
        return res.status(200).json({ msg: "UnFollow & Confirm or Reject" });
      }
      return res.status(200).json({ msg: "Follow & Confirm or Reject" });
    }

    if (friends.length > 0 && requests.length == 0) {
      if (follows.length > 0) {
        return res.status(200).json({ msg: "UnFollow & UnFriend" });
      }
      return res.status(200).json({ msg: "Follow & UnFriend" });
    }

    return res.status(400).json({ friends });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userDetailsRouter;
