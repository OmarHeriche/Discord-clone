const express = require('express');
const {getAllFriends,getSingleFriend,addFriend,deleteFriend}=require('../controllers/friend');

const router = express.Router();
router.route('/').get(getAllFriends).post(addFriend);
router.route('/:id').get(getSingleFriend).delete(deleteFriend);

module.exports = router;