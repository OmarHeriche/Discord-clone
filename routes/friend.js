const express = require('express');
const {getAllFriends,getSingleFriend,deleteFriend}=require('../controllers/friend');

const router = express.Router();
router.route('/').get(getAllFriends);
router.route('/:userId').get(getSingleFriend)
router.route('/:userId').delete(deleteFriend);

module.exports = router;