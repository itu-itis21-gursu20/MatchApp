const Image = require("../models/Image.js");
const User = require("../models/User.js");

const addImage = async (req, res) => {
    const newImage = new Image({
        userId: req.user.id, ...req.body
    });
    try {
        const savedImage = await newImage.save();
        // await User.findByIdAndUpdate( req.user.id, 
        //     {
        //         $push: { images: savedImage._id } 
        //     }
        //     );
        await User.findByIdAndUpdate( req.user.id,
            {
                $inc: { imageNumber: 1}
            });
        res.status(200).json(savedImage);
    } catch(err) {
        res.status(500).json(err);
    }
}


const updateImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if(!image) res.status(500).json(err);
        if(req.user.id === image.userId) {
            const updatedImage = await Image.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                {
                    new: true
                }
            );
            res.status(200).json(updatedImage);
        } else {
            return res.status(500).json(err);
        }
    } catch(err) {
        res.status(500).json(err);
    }
}
const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if(!image) return res.status(500).json(err);

        if(req.user.id === image.userId) {
            await Image.findByIdAndDelete(
                req.params.id,
            );
            res.status(200).json("The image has been deleted");
        } else {
            return res.status(500).json(err);
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

const getImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        res.status(200).json(image);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getImages = async (req, res) => {
    try {
        // Capture the userId from the endpoint

        // Query the database for all images with the captured userId
        const images = await Image.find({ userId: req.params.userId });

        // Return the images in the response
        res.status(200).json(images);
    } catch(err) {
        console.error(`Error fetching images for userId: ${userId} - `, err);
        res.status(500).json({ error: err.message });
    }
};
const random = async (req, res) => {
    try {
        const id = req.params.id;

        const images = await Image.aggregate(
            [
                {
                    $match: { userId: { $ne: id } }
                },
                {
                    $sample: { size: 20 }
                }
            ]);
        res.status(200).json(images);
    } catch(err) {
        res.status(500).json(err);
    }
}

const random_1 = async (req, res) => {
    try {
        const images = await Image.aggregate(
            [
                {
                    $sample: { size: 1 }
                }
            ])
        res.status(200).json(images);
    } catch(err) {
        res.status(500).json(err);
    }
}

const incPoint = async (req, res) => {
    try {
        const image = await Image.findByIdAndUpdate(req.params.id, {
            $inc: { point:1 }
        });

        const user = await User.findByIdAndUpdate(image.userId, {
            $inc: { totalPoint: 1 }
        });
        res.status(200).json(image);
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    addImage,
    updateImage,
    deleteImage,
    getImage,
    getImages,
    random,
    incPoint,
    random_1
}