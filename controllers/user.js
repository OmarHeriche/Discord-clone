const User = require("../models/user");
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res
    .status(200)
    .json({ success: true, data: users, numberOfUsers: users.length });
};
const getSingleUser = async (req, res) => {
  const userId = req.params.userId;
  const singleUser = await User.findOne({ _id: userId });
  if(!singleUser) return res.status(404).json({success:false,message:`user with id ${userId} not found`});
  res.status(200).json({ success: true, data: singleUser });
};
module.exports = {
  getAllUsers,
  getSingleUser,
};
