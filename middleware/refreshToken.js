const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require("dotenv").config();

const refreshToken = async (req,res,next)=>{
    const expirationTime = req.cookies.expire;
    const currentTime = Math.floor(Date.now() / 1000);
    if(currentTime < expirationTime){
        // console.log("the access token is still valid");
        next();
        return;
    }
    // console.log("🚨🚨🚨🚨🚨🚨🚨🚨the refreshToken middleware is invoked 🚨🚨🚨🚨🚨🚨🚨🚨");
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({success:false,message:"please login first"});
    }
    try {
        const payload = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        req.user={
            userId:payload.userId,
            userName: payload.userName
        }
        const newAccessToken = jwt.sign({userId:payload.userId,userName:payload.userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10s"});
        res.cookie("accessToken",newAccessToken,{
            httpOnly:true,
            maxAge:1000*60*60*24*30//!30 days
        });
        const l3iba = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
        const expire=l3iba.exp;
        res.cookie("expire", expire, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        next();
    } catch (error) {
        console.log("error in refreshToken middleware");
        return res.status(401).json({success:false,message:"please login first"});
        next();
    }
}
module.exports = refreshToken;