const Friend = require("../models/user_friend");
const User = require("../models/user");
const redis = require("../db/connect_redis");

const max_number_of_friends_per_list = 20; //todo the caching policy for this will be LRU;

const getAllFriends = async (req, res) => {
    try {
        const theOwner = `${req.user.userId}-friends`;
        let friendsInfos;
        friendsInfos = await redis.lrange(theOwner, 0, -1);
        if (friendsInfos.length > 0) {
            return res
                .status(200)
                .json({ cache: "cach hit", success: true, data: friendsInfos });
        }
        const allFriendsRelations = await Friend.find({
            userID: req.user.userId,
        });
        const promisesArray = await allFriendsRelations.map(async (friend) => {
            //! every time im doing a full body scan of the user collection to get the friend info, this is not efficient, i should use the populate method to get the friend info
            friend = await User.findOne({ _id: friend.friendID.toString() });
            if (!friend) {
                /*🦈**/ return res.status(404).json({
                    success: false,
                    msg: `friend with id ${req.params.userId} not found`,
                });
            }
            return friend;
        });
        friendsInfos = await Promise.all(promisesArray); //?is this will wait for all promises to be resolved before returning the result?=>yesyes🫡
        const friendsInfos_slice = friendsInfos.slice(
            0,
            max_number_of_friends_per_list
        );
        await redis.del(theOwner);
        friendsInfos_slice.forEach(async (friendInfos) => {
            await redis.rpush(theOwner, JSON.stringify(friendInfos));
        });
        res.status(200).json({
            cache: "cach miss",
            success: true,
            data: friendsInfos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal sever error",
            errorMessage: error.message,
        });
    }
};

const getSingleFriend = async (req, res) => {
    try {
        const theOwner = `${req.user.userId}-friends`;
        let friend = null;
        friend = await redis.lrange(theOwner, 0, -1);
        if (friend.length > 0) {
            friend = friend.find((friend) => friend._id === req.params.userId);
            //?delete this friend and moove him to the top of the list like the policy of LRU
            await redis.lrem(theOwner, 0, friend);
            await redis.lpush(theOwner, friend);
            return res.status(200).json({
                cache: "cach hit",
                success: true,
                friendInfos: friend,
            });
        }
        const singleFriend = await Friend.findOne({
            userID: req.user.userId,
            friendID: req.params.userId,
        });
        if (!singleFriend) {
            /*🦈**/ return res.status(404).json({
                success: false,
                msg: `friend with id ${req.params.userId} not found`,
            });
        }
        friend = await User.findById(req.params.userId);
        res.status(200).json({
            cache: "cach miss",
            success: true,
            relationInfos: singleFriend,
            friendInfos: friend,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const deleteFriend = async (req, res) => {
    try {
        const theOwner= `${req.user.userId}-friends`;
        const friendToBeDeleted = await Friend.findOneAndDelete({
            userID: req.user.userId,
            friendID: req.params.userId,
        });
        if (!friendToBeDeleted) {
            /*🦈**/ return res.status(404).json({
                success: false,
                msg: `friend with id ${req.params.userId} not found`,
            });
        }
        let cachedFriends = await redis.lrange(theOwner, 0, -1);
        console.log(cachedFriends);
        cachedFriends = cachedFriends.filter((cachedFriend) => {
            return cachedFriend._id !== req.params.userId;
        });
        await redis.del(theOwner);
        cachedFriends.forEach(async (cachedFriend) => {
            await redis.rpush(theOwner, JSON.stringify(cachedFriend));
        });
        res.status(200).json({
            success: true,
            msg: `friend with id ${req.params.userId} deleted`,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = {
    getAllFriends,
    getSingleFriend,
    deleteFriend,
};
