const getAllUsers = (req,res)=>{
    res.status(200).json({success:true,msg:'get all users'});
}
const getSingleUser = (req,res)=>{
    res.status(200).json({success:true,msg:`get user with id ${req.params.id}`});
}
module.exports = {
    getAllUsers,
    getSingleUser,
}