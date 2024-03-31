const express = require('express');
const {getAllUsers,getSingleUser}=require('../controllers/user');

const router = express.Router();
router.route('/').get(getAllUsers);
router.route('/:id').get(getSingleUser);

module.exports = router;