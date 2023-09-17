const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true, 
    },
    imgUrl: {
        type: String,
        required: true,
    },
    point: {
        type: Number,
        default: 0
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model("Image", ImageSchema);