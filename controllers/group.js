const Group = require("../models/group");
const UserGroup = require("../models/user_group");

const getAllGroups = async (req, res) => {
  try {
    const userGroupArray = await UserGroup.find({ userID: req.user.userId });
    const promisesArray = await userGroupArray.map(async (relation_userGroup) => {//! this is the wors aproach i'ts only for the first version :).
      relation_userGroup = await Group.findOne({ _id: relation_userGroup.groupID.toString() });
      if (!relation_userGroup) {
        return res.status(404).json({
          success: false,
          msg: `group with id ${req.params.groupId} not found`,
        });
      }
      return relation_userGroup;
    });
    const goupsInfos = await Promise.all(promisesArray);
    res.status(200).json({ success: true, data: goupsInfos });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const getSingleGroup = async (req, res) => {
  try {
    const targetedGroup = await Group.findOne({_id:req.params.groupId});
    if(!targetedGroup){
      return res.status(404).json({success:false,msg:`group with id ${req.params.groupId} not found`});
    }
    res.status(200).json({success:true,data:targetedGroup});
  } catch (error) {
    res.status(500).json({success:false,msg:error.message});
  }
};
const addGroup = async (req, res) => {//!done
  try {
    //? Create the group : in the req.body we have the groupName and we should init the userID from the token.and after we need to have the groupName in the req.body.
    const newGroup = await Group.create({groupName:req.body.groupName});
    //? refrence the new group from the user_group.
    req.body.userID = req.user.userId;
    await UserGroup.create({userID:req.body.userID,groupID:newGroup._id,role:"admin"});//?enum: ["admin", "member","omar"];
    //? send the response.
    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const deleteGroup = async (req, res) => {
  try {
    //todo 1 delte group from the user_group.
    //todo 1.1 check the role of the user.
    const the_relation_userGroup_that_willBeDeleted = await UserGroup.findOne({userID:req.user.userId,groupID:req.params.groupId});
    if(the_relation_userGroup_that_willBeDeleted.role!=="admin"){
      return res.status(400).json({success:false,msg:`you are not a admin do delete this group`});
    }

    const arrayOfRelationsToDelete = await UserGroup.find({groupID:req.params.groupId});
    if(!arrayOfRelationsToDelete){
      return res.status(404).json({success:false,msg:`group with id ${req.params.groupId} not found`});
    }
    const promisesArray = await arrayOfRelationsToDelete.map(async (relation_userGroup) => {
      relation_userGroup = await UserGroup.findOneAndDelete({userID:relation_userGroup.userID,groupID:relation_userGroup.groupID});
      return relation_userGroup;
    });
    await Promise.all(promisesArray);
    //todo 2 delete the group from the group collection.
    const deletedGroup = await Group.findOneAndDelete({_id:req.params.groupId});
    if(!deletedGroup){
      return res.status(404).json({success:false,msg:`group with id ${req.params.groupId} not found`});
    }
    res.status(200).json({ success: true, msg: `group with id ${req.params.groupId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const updateGroup = async (req, res) => {
  try {
    const the_relation_userGroup_that_willBeUpdated = await UserGroup.findOne({userID:req.user.userId,groupID:req.params.groupId});
    if(the_relation_userGroup_that_willBeUpdated.role!=="admin"){
      return res.status(400).json({success:false,msg:`you are not a admin do update this group`});
    }
    const updatedGroup = await Group.findOneAndUpdate({_id: req.params.groupId},{groupName:req.body.groupName},{ new: true, runValidators: true });
    if(!updatedGroup){
      return res.status(404).json({success:false,msg:`group with id ${req.params.groupId} not found`});
    }
    res.status(200).json({ success: true, data: updatedGroup });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
const addUserToGroup = async (req, res) => {
  try {
    //? check if the user is already in the group && if the user is the admin of the group.
    const checkUserInGroup = await UserGroup.findOne({userID:req.user.userId,groupID:req.params.groupId});
    if(!checkUserInGroup || checkUserInGroup.role!=="admin"){
      return res.status(400).json({success:false,msg:`you are not a admin do add user to this group or you are not a member of this group`});
    }
    const created_relation_userGroup = await UserGroup.create({userID:req.params.userId,groupID:req.params.groupId,role:"member"});
    res.status(201).json({ success: true, data: created_relation_userGroup });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
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
