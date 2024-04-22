const mongoose = require("mongoose");

const UserFriendSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "please provide user id"],
    },
    friendID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "please provide friend id"],
    },
},{timestamps: true});

//?make the combination of userID and friendID unique.
UserFriendSchema.index({ userID: 1, friendID: 1 }, { unique: true });

module.exports = mongoose.model("UserFriend", UserFriendSchema); 