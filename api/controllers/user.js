const User = require("../models/User.js");
const Image = require("../models/Image.js");
const CryptoJS = require("crypto-js");

const updateUser = async (req, res) => {

  if (req.body.password) {

    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();

  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getUserByImage = async (req, res) => {
  try{
    const image = await Image.findById(req.params.imageId); 

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    const user = await User.findById(image.userId);

    // If no user is found, return an error
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Return the user in the response
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json(err);
  }
}

const getUserDetails = async (req, res) => {
  try {
    const ids = req.query.ids.split(','); // Assuming you pass ids as a comma-separated string
      const users = await User.find({
          '_id': { $in: ids }
      });
      res.status(200).send(users);
  } catch (error) {
      res.status(500).send("Error fetching users");
  }
}

// const getAllUsers = async (req, res) => { 
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// }

const getAllUsers = async (req, res) => {
  try {
      const sortQuery = req.query.sort;  // e.g., /your-endpoint?sort=asc or /your-endpoint?sort=desc
      let sortOrder = {};  // Default, no sort applied

      if (sortQuery === 'asc') {
          sortOrder = { totalPoint: 1 };  // Ascending order
      } else if (sortQuery === 'desc') {
          sortOrder = { totalPoint: -1 }; // Descending order
      }

      // Pagination
      const limit = Number(req.query.limit) || 10; // Default to 10 if not provided
      const offset = Number(req.query.offset) || 0; // Default to 0 if not provided

      const users = await User.find()
                                .sort(sortOrder)
                                .limit(limit)
                                .skip(offset)
                                .exec();

      res.status(200).json(users);

  } catch(err) {
      res.status(500).json({ error: err.message });
  }
};


// const selectImage = async (req, res) => { // verify olmalı
//   const id = req.user.id;
//   const imageId = req.params.imageId;
//   try {
//     await Image.findByIdAndUpdate(videoId,{
//       $inc: {point : 1},

//     })
//     res.status(200).json("The image has been selected.")
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

const follow = async (req, res) => { // verify olmalı

  console.log("follow");
  try {

    await User.findByIdAndUpdate(req.user.id, { 
      $push: { followedUsers: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, { 
      $push: { followers: req.user.id },
    });

    res.status(200).json("Follow is successful.")

  } catch (err) {
    res.status(500).json(err);
  }
};

const unfollow = async (req, res) => { // verify olmalı

  console.log("unfollow");
    try {

      await User.findByIdAndUpdate(req.user.id, {
        $pull: { followedUsers: req.params.id },
      });

      await User.findByIdAndUpdate(req.params.id, { 
        $pull: { followers: req.user.id },
      });

      res.status(200).json("Unfollow is successful.")

    } catch (err) {
      res.status(500).json(err);
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    follow,
    unfollow,
    getUserByImage,
    getUserDetails
}
