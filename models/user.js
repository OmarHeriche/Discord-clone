const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please add a name"],
    minlength: 3,
    maxlength: 20,//?because of the example ahmad gamare eddine mahfoude debiaza🫡
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "pleas provide a valide email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
  },
},{timestamps: true});

module.exports = mongoose.model("User", UserSchema);