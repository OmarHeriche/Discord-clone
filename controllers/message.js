const Message = require("../models/message");

const getAllMessages = async (req, res) => {
    req.body.createdBy = req.user.userId;
    req.body.recipientId = req.params.recipientId;
    const messagesCreatedByMe = await Message.find(req.body).sort("createdAt");
    const messagesReceivedByMe = await Message.find({createdBy:req.body.recipientId,recipientId:req.body.createdBy}).sort("createdAt");
    const messages = messagesCreatedByMe.concat(messagesReceivedByMe);
    //?sorting messages by createdAt
    messages.sort((a, b) => {
        return a.createdAt - b.createdAt;
    });
    res.status(200).json({ success: true, data: messages });
};
const createMessage = async (req, res) => {
    req.body.createdBy = req.user.userId;
    req.body.recipientId = req.params.recipientId;
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, data: message });
};
const updateMessage = async (req, res) => {
    req.body.createdBy = req.user.userId;
    req.body.recipientId = req.params.recipientId;
    const messageId = req.params.messageId;
    const newMessage = await Message.findOneAndUpdate(
        {
            _id: messageId,
            createdBy: req.body.createdBy,
            recipientId: req.body.recipientId,
        },
        { messageContent: req.body.messageContent },
        { new: true, runValidators: true }
    );
    if (!newMessage) {
        return res.status(404).json({
            msg: `there is no message with id = ${messageId}`,
            success: false,
        });
    }
    res.status(200).json({ success: true, data: newMessage });
};
const deleteMessage = async (req, res) => {
    req.body.createdBy = req.user.userId;
    req.body.recipientId = req.params.recipientId;
    const messageId = req.params.messageId;
    const deletedMessage = await Message.findOneAndDelete({
        _id: messageId,
        createdBy: req.body.createdBy,
        recipientId: req.body.recipientId,
    });
    if (!deleteMessage) {
        return res.status(404).json({
            msg: `there is no message with id = ${messageId}`,
            success: false,
        });
    }
    res.status(200).json({ success: true, data: deletedMessage });
};
module.exports = {
    createMessage,
    getAllMessages,
    updateMessage,
    deleteMessage,
};
