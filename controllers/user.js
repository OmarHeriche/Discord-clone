const User = require("../models/user");
const Friend = require("../models/user_friend");
const redis = require("../db/connect_redis");

const max_number_of_friends_per_list = 20; //todo the caching policy for this will be LRU;

const getAllUsers = async (req, res) => {
    const userName = req.query.userName;
    const queryObject = {};
    if (userName) {
        queryObject.userName = { $regex: userName, $options: "i" };
    }
    const users = await User.find(queryObject).sort("userName");
    if (!users)
        return res.status(404).json({
            success: false,
            message: `user with name ${userName} not found`,
        });
    res.status(200).json({
        success: true,
        data: users,
        numberOfUsers: users.length,
    });
};

const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const singleUser = await User.findOne({ _id: userId });
        if (!singleUser)
            return res.status(404).json({
                success: false,
                message: `user with id ${userId} not found`,
            });
        res.status(200).json({ success: true, data: singleUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addFriend = async (req, res) => {
    try {
        const theOwner = `${req.user.userId}-friends`;
        //! this function will create a new friend for one single side , the other side should create a new friend as well when he accept the friend request.
        req.body.userID = req.user.userId;
        req.body.friendID = req.params.userId;
        const newFriend = await Friend.create(req.body);
        if (!newFriend)
            return res.status(404).json({
                success: false,
                message: `friend with id ${req.params.userId} not found`,
            });
        const new_friend = await User.findOne({_id:req.params.userId})//!this line is tooooo baad ylzm nbdlha 
        const cachedFriends = await redis.lrange(theOwner, 0, -1);
        if(cachedFriends.length === max_number_of_friends_per_list){
            await redis.rpop(theOwner);
        }
        await redis.rpush(theOwner, JSON.stringify(new_friend));
        res.status(201).json({ success: true, data: newFriend });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    addFriend,
};
