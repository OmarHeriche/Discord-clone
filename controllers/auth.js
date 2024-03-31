
const register = (req,res)=>{
    res.status(200).json({success:true,msg:'register'});
}

const login = (req,res)=>{
    res.status(200).json({success:true,msg:'login'});
}
module.exports = {
    register,
    login
}
