const mongoose = require("mongoose");

const UserGroupSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "please provide user id"],
    },
    groupID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: [true, "please provide group id"],
    },
    role: {
        type: String,
        enum: ["admin", "member","omar"],
        default: "member",
    },
},{timestamps: true});


module.exports = mongoose.model("UserGroup", UserGroupSchema);