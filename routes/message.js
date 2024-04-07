const express = require('express');
const {
    getAllMessages,
    createMessage,
    deleteMessage,
    updateMessage
}=require('../controllers/message');

const router = express.Router();
router.route('/:recipientId').post(createMessage).get(getAllMessages);
router.route('/:recipientId/:messageId').patch(updateMessage).delete(deleteMessage);
module.exports = router;