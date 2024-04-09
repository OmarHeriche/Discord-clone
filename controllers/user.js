const User = require("../models/user");
const getAllUsers = async (req, res) => {
  const userName = req.query.userName;
  const queryObject = {};
  if(userName){
    queryObject.userName = { $regex: userName, $options: "i" };
  }
  const users = await User.find(queryObject).sort("userName");
  if(!users) return res.status(404).json({success:false,message:`user with name ${userName} not found`});
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
