const jwt = require('jsonwebtoken');
require('dotenv').config()

const auth = async (req,res,next)=>{
    // console.log("✨✨✨✨✨✨auth middleware is working✨✨✨✨✨✨");//todo remove this line
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({error: "User not authenticated"});
    }
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user={
            userId:payload.userId,
            userName: payload.userName
        }
        next();
    } catch (error) {
        // console.log("🤌")
        next();
        return
    }
}

module.exports = auth;