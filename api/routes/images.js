const express = require("express");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken.js');

const {
    addImage,
    updateImage,
    deleteImage,
    getImage,   
    getImagesByUserId,   
    random,
    incPoint,
    getAllImages
} = require('../controllers/image.js')

const router = express.Router();

router.post("/", verifyTokenAndAuthorization, addImage); // req.user
router.put("/:id", verifyTokenAndAuthorization, updateImage);
router.delete("/:id", verifyTokenAndAuthorization, deleteImage);
router.get("/find/:id", getImage);
router.get("/find/berkay/:userId", getImagesByUserId); // get all images by userId - it is done after /users/find/:id so removed verifyTokenAndAuthorization from here
router.get("/random/:id", random); 
router.get("/point/:id", incPoint);
router.get("/find", getAllImages);

module.exports = router;
