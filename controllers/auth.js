const User = require("../models/user");
require("dotenv").config();
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = await User.create({ userName, email, password });
        //!create access token
        const accessToken = user.createAccessToken();
        //!send access token in cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, //!30 days
        });
        const l3iba = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const expire = l3iba.exp;
        res.cookie("expire", expire, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        //!create refresh token
        const refreshToken = user.createRefreshToken();
        //!send refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, //!30 days
        });
        //!send response
        res.status(201).json({ success: true, name: user.userName,userId:user._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,errorPoint:"from register controller"});
    }
};
/*
  !login requirements:
    !get user using the unique email
    !check the password if it is correct
    !create access token and refresh token
    !send them to res.cookie
    !send the response=>{success:true,name:userName}
*/
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide email and password",
            });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `the user with ${email} is not found`,
            });
        }
        if (!user.validePassword(password)) {
            return res
                .status(400)
                .json({ success: false, message: "invalid password" });
        }
        //!create access token
        const accessToken = user.createAccessToken();
        //!send access token in cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, //!30 days
        });
        const l3iba = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const expire = l3iba.exp;
        res.cookie("expire", expire, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        //!create refresh token
        const refreshToken = user.createRefreshToken();
        //!send refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, //!30 days
        });
        //!send response
        res.status(200).json({
            success: true,
            name: user.userName,
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,errorPoint:"from login controller" });
    }
};
module.exports = {
    register,
    login,
};
