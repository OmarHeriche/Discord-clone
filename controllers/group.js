const getAllGroups = (req, res) => {
  res.status(200).json({ success: true, msg: `get all groups` });
};
const getSingleGroup = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `get group with id ${req.params.id}` });
};
const addGroup = (req, res) => {
  res.status(200).json({ success: true, msg: `add new group ` });
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
