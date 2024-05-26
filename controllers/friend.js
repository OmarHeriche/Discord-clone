const Friend = require("../models/user_friend");
const User = require("../models/user");

const getAllFriends = async (req, res) => {
    try {
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
        const friendsInfos = await Promise.all(promisesArray); //?is this will wait for all promises to be resolved before returning the result?=>yesyes🫡
        res.status(200).json({
            success: true,
            data: friendsInfos,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
const getSingleFriend = async (req, res) => {
    try {
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
        const friend = await User.findById(req.params.userId);
        res.status(200).json({
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
        const friendToBeDeleted = await Friend.findByIdAndDelete({
            _id: req.params.relationId,
            userID: req.user.userId,
            friendID: req.params.userId,
        });
        if (!friendToBeDeleted) {
            /*🦈**/ return res.status(404).json({
                success: false,
                msg: `friend with id ${req.params.userId} not found`,
            });
        }
        res.status(200).json({
            success: true,
            msg: `friend with id ${req.params.userId} deleted`,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = {
    getAllFriends,
    getSingleFriend,
    deleteFriend,
};
