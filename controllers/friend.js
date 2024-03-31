const getAllFriends = (req,res)=>{
    res.status(200).json({success:true,msg:`get all friends`});
}
const getSingleFriend = (req,res)=>{
    res.status(200).json({success:true,msg:`get friend with id ${req.params.id}`});
}
const addFriend = (req,res)=>{
    res.status(200).json({success:true,msg:`add new friend `});
}
const deleteFriend = (req,res)=>{
    res.status(200).json({success:true,msg:`delete friend with id ${req.params.id}`});
}

module.exports = {
    getAllFriends,
    getSingleFriend,
    addFriend,
    deleteFriend,
}