const Image = require("../models/Image.js");
const User = require("../models/User.js");

const addImage = async (req, res) => { // verify olmalı
    console.log("req.user", req.user)
    const newImage = new Image({
        userId: req.user.id, username: req.user.username, ...req.body
    });
    console.log("newImage", newImage);
    try {
        const savedImage = await newImage.save();
        await User.findByIdAndUpdate( req.user.id,
            {
                $inc: { imageNumber: 1 }
            });
        res.status(200).json(savedImage);
        console.log("savedImage", savedImage);
    } catch(err) {
        res.status(500).json(err);
    }
}


const updateImage = async (req, res) => { // verify olmalı
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
const deleteImage = async (req, res) => { // verify olmalı
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

const getImagesByUserId = async (req, res) => {

    try {
        const images = await Image.find({ userId: req.params.userId });
        res.status(200).json(images);

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};


// const getAllImages = async (req, res) => {
//     try {
//         const sortQuery = req.query.sort;  // e.g., /your-endpoint?sort=asc or /your-endpoint?sort=desc
//         let sortOrder = {};  // Default, no sort applied

//         if (sortQuery === 'asc') {
//             sortOrder = { point: 1 };  // Ascending order
//         } else if (sortQuery === 'desc') {
//             sortOrder = { point: -1 }; // Descending order
//         }

//         const images = await Image.find().sort(sortOrder);
//         res.status(200).json(images);

//     } catch(err) {
//         res.status(500).json({ error: err.message });
//     }
// };

const getAllImages = async (req, res) => {
    try {
        // Sorting
        const sortQuery = req.query.sort; 
        let sortOrder = {};  // Default, no sort applied

        if (sortQuery === 'asc') {
            sortOrder = { point: 1 };  // Ascending order
        } else if (sortQuery === 'desc') {
            sortOrder = { point: -1 }; // Descending order
        }

        // Pagination
        const limit = Number(req.query.limit) || 10; // Default to 10 if not provided
        const offset = Number(req.query.offset) || 0; // Default to 0 if not provided

        const images = await Image.find()
                                  .sort(sortOrder)
                                  .limit(limit)
                                  .skip(offset)
                                  .exec();

        res.status(200).json(images);

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};




const random = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id", id);

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

// const random_1 = async (req, res) => {
//     try {
//         const images = await Image.aggregate(
//             [
//                 {
//                     $sample: { size: 1 }
//                 }
//             ])
//         res.status(200).json(images);
//     } catch(err) {
//         res.status(500).json(err);
//     }
// }

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
    getImagesByUserId,
    random,
    incPoint,
    getAllImages
    // random_1
}