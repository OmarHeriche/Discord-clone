const express = require('express');
const {
    getAllMessages,
    createMessage,
    deleteMessage,
    updateMessage
}=require('../controllers/message');

const router = express.Router();
router.route('/').get(getAllMessages).post(createMessage);
router.route('/:id').delete(deleteMessage).patch(updateMessage);
module.exports = router;