const express = require('express');
const {getAllUsers,getSingleUser,addFriend} = require('../controllers/user');

const router = express.Router();
router.route('/').get(getAllUsers);
router.route('/:userId').get(getSingleUser).post(addFriend);

module.exports = router;