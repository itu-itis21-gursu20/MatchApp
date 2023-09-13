const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    profileImg : {
        type: String,
    },
    followers: { // beni takip edenler
        type: [String]
    },
    followersNumber: { // beni takip edenlerin sayısı
        type: Number,
        default: 0,
    },
    followedUsers: { // benim takip ettiklerim
        type: [String]
    },
    followedUsersNumber: { // benim takip ettiklerimin sayısı
        type: Number,
        default: 0
    },
    images: {
        type: [String]
    },
    imageNumber: {
        type: Number,
        default: 0
    },
    totalPoint: {
        type: Number,
        default: 0
    } 
},
{
    timestamps: true
}
)

module.exports = mongoose.model("User", UserSchema);