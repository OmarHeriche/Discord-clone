const express = require('express');
const {
    getAllGroups,
    addGroup,
    getSingleGroup,
    deleteGroup,
    updateGroup,
    addUserToGroup,
    deleteUserFromGroup
}=require('../controllers/group');

const router = express.Router();
router.route('/').get(getAllGroups).post(addGroup);
router.route('/:id').get(getSingleGroup).delete(deleteGroup).patch(updateGroup);
router.route('/:groupId/:userId').post(addUserToGroup).delete(deleteUserFromGroup);

module.exports = router;