const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: [true, "Please add a group name"],
        minlength: 3,
        maxlength: 20,
    },
},{timestamps: true});
module.exports = mongoose.model("Group", GroupSchema);