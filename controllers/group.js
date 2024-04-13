const Group = require("../models/group");
const UserGroup = require("../models/user_group");

const getAllGroups = (req, res) => {
  
};
const getSingleGroup = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `get group with id ${req.params.id}` });
};
const addGroup = async (req, res) => {//!done
  try {
    //? Create the group:in the req.body we have the groupName and we should init the userID from the token.and after we need to have the groupName in the req.body.
    req.body.userID = req.user.userId;
    const newGroup = await Group.create({groupName:req.body.groupName});
    //? refrence the new group from the user_group.
    await UserGroup.create({userID:req.body.userID,groupID:newGroup._id,role:"admin"});//?enum: ["admin", "member","omar"];
    //? send the response.
    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const deleteGroup = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `delete group with id ${req.params.id}` });
};
const updateGroup = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `update group with id ${req.params.id}` });
};
const addUserToGroup = (req, res) => {
  res.status(200).json({
    success: true,
    msg: {
      msg: "add user to group",
      groupId: req.params.groupId,
      userId: req.params.userId,
    },
  });
};
const deleteUserFromGroup = (req, res) => {
  res.status(200).json({
    success: true,
    msg: {
      msg: "delete user from group",
      groupId: req.params.groupId,
      userId: req.params.userId,
    },
  });
};
module.exports = {
  getAllGroups,
  getSingleGroup,
  addGroup,
  deleteGroup,
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
};
