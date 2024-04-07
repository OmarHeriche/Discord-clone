const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add a name"],
      minlength: 3,
      maxlength: 20, //?because of the example ahmad gamare eddine mahfoude debiaza🫡
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
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, userName: this.userName },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};
UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userId: this._id, userName: this.userName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
  );
};
UserSchema.methods.validePassword=function (notHashedPassword){
  return bcrypt.compareSync(notHashedPassword,this.password);
}

module.exports = mongoose.model("User", UserSchema);
