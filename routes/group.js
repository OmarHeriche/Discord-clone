const express = require('express');
const {
    getAllGroups,
    addGroup,
    getSingleGroup,
    deleteGroup,
    updateGroup,
    addUserToGroup,
    deleteUserFromGroup,
    getAllMembersOfGroup
}=require('../controllers/group');

const router = express.Router();
router.route('/').get(getAllGroups).post(addGroup);
router.route('/:groupId').get(getSingleGroup).delete(deleteGroup).patch(updateGroup);
router.route('/:groupId/members').get(getAllMembersOfGroup);
router.route('/:groupId/members/:userId').post(addUserToGroup).delete(deleteUserFromGroup);

module.exports = router;