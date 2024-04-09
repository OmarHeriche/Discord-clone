const express = require('express');
const {getAllUsers,getSingleUser}=require('../controllers/user');

const router = express.Router();
router.route('/').get(getAllUsers);
router.route('/:userId').get(getSingleUser);

module.exports = router;