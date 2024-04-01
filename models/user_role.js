const mongoose = require("mongoose");

const UserRoleScheema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "please provide user id"],
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: [true, "please provide role id"],
    },
},{timestamps: true});
module.exports= mongoose.model("UserRole", UserRoleScheema);