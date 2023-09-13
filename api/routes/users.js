const express = require("express");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken.js');
const {     
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    getUserByImage,
    getUserDetails,
    follow,
    unfollow
} = require("../controllers/user.js");

const router = express.Router();

router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);
router.get("/find/:id", getUser);
router.get("/find/mahmut/:imageId", getUserByImage);
router.get("/", getAllUsers);
router.get("/findMultiple", getUserDetails);

router.put("/follow/:id", verifyTokenAndAuthorization, follow); // buradaki id takip edilecek olanın userId dir
router.put("/unfollow/:id", verifyTokenAndAuthorization, unfollow);


module.exports = router;

// paramstaki id userId değilse sıkıntı olur verifytokenlara bak
