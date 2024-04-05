const User = require('../models/user');
const cookie= require('cookie-parser');


const register = async (req,res)=>{
    const {userName,email,password} = req.body;
    const user = await User.create({userName,email,password});
    //!create access token
    const accessToken= user.createAccessToken();
    //!send access token in cookie
    res.cookie('accessToken',accessToken,{
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24 * 30,//!30 days
    });
    //!create refresh token
    const refreshToken= user.createRefreshToken();
    //!send refresh token in cookie
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24 * 30,//!30 days
    });
    //!send response
    res.status(201).json({success:true,name:user.userName});
}

const login = (req,res)=>{
    res.status(200).json({success:true,msg:'login'});
}
module.exports = {
    register,
    login
}
