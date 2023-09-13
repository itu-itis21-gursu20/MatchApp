const express = require("express");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken.js');

const {
    addImage,
    updateImage,
    deleteImage,
    getImage,   
    getImages,   
    random,
    incPoint,
} = require('../controllers/image.js')

const router = express.Router();

router.post("/", verifyTokenAndAuthorization, addImage); // verifyTokendı
router.put("/:id", verifyTokenAndAuthorization, updateImage);
router.delete("/:id", verifyTokenAndAuthorization, deleteImage);
router.get("/find/:id", getImage);
router.get("/find/berkay/:userId", getImages); // get all images by userId - it is done after /users/find/:id so removed verifyTokenAndAuthorization from here
router.get("/random/:id", verifyTokenAndAuthorization, random); // verifyTokendı
router.get("/point/:id", incPoint);

module.exports = router;
