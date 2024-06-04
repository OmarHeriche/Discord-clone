const Message = require("../models/message");
const redis = require("../db/connect_redis");
const message = require("../models/message");
const max_number_of_messages_per_time = 10;

const getAllMessages = async (req, res) => {
    try {
        const theOwner = `${req.user.userId}-${req.params.recipientId}`;
        req.body.createdBy = req.user.userId;
        req.body.recipientId = req.params.recipientId;
        let messages = null;
        messages = await redis.lrange(theOwner, 0, -1);

        if (messages.length > 0) {
            messages.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
            return res
                .status(200)
                .json({ cache: "cach hit", success: true, data: messages });
        }

        const messagesCreatedByMe = await Message.find(req.body).sort(
            "createdAt"
        );
        const messagesReceivedByMe = await Message.find({
            createdBy: req.body.recipientId,
            recipientId: req.body.createdBy,
        }).sort("createdAt");
        messages = messagesCreatedByMe.concat(messagesReceivedByMe);
        //?sorting messages by createdAt
        messages.sort((a, b) => {
            return a.createdAt - b.createdAt;
        });
        messages = messages.slice(0, max_number_of_messages_per_time);
        //?caching messages one by one
        messages.forEach(async (message) => {
            await redis.lpop(theOwner); //?removing the oldest message
            await redis.rpush(theOwner, JSON.stringify(message)); //?adding the newest message
        });
        res.status(200).json({
            cache: "cach miss",
            success: true,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal sever error",
            errorMessage: error.message,
        });
    }
};

const createMessage = async (req, res) => {
    //todo the caching policy to use in this commit : walk back.
    try {
        const theOwner = `${req.user.userId}-${req.params.recipientId}`;
        req.body.createdBy = req.user.userId;
        req.body.recipientId = req.params.recipientId;
        let cpt = await redis.llen(theOwner);
        if (cpt === max_number_of_messages_per_time) {
            await redis.lpop(theOwner);
        }
        let message = await Message.create(req.body);
        await redis.rpush(theOwner, JSON.stringify(message));
        res.status(201).json({
            cachLength: cpt,
            success: true,
            data: message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal sever error",
            errorMessage: error.message,
        });
    }
};

const updateMessage = async (req, res) => {
    //todo the caching policy to use in this commit : walk back.
    try {
        const theOwner = `${req.user.userId}-${req.params.recipientId}`;
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
        //?check if the message is in the cache
        let cachedMessages = await redis.lrange(theOwner, 0, -1);
        cachedMessages = cachedMessages.map((cachedMessage) => {
            if (cachedMessage._id === messageId) {
                return (cachedMessage = newMessage);
            }
            return cachedMessage;
        });
        await redis.del(theOwner);//?from the futur kyna haja y9ololha lrem bzaf mliha 👀
        cachedMessages.forEach(async (cachedMessages) => {
            await redis.rpush(theOwner, JSON.stringify(cachedMessages));
        });
        if (!newMessage) {
            return res.status(404).json({
                msg: `there is no message with id = ${messageId}`,
                success: false,
            });
        }
        res.status(200).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal sever error",
            errorMessage: error.message,
        });
    }
};

const deleteMessage = async (req, res) => {
    //todo the caching policy to use in this commit : walk back.
    try {
        const theOwner = `${req.user.userId}-${req.params.recipientId}`;
        req.body.createdBy = req.user.userId;
        req.body.recipientId = req.params.recipientId;
        const messageId = req.params.messageId;
        const deletedMessage = await Message.findOneAndDelete({
            _id: messageId,
            createdBy: req.body.createdBy,
            recipientId: req.body.recipientId,
        });
        //?check if the message is in the cache
        let cachedMessages = await redis.lrange(theOwner, 0, -1);
        cachedMessages = cachedMessages.filter((cachedMessages) => {
            return cachedMessages._id !== messageId;
        });
        await redis.del(theOwner);//?from the futur kyna haja y9ololha lrem bzaf mliha 👀
        cachedMessages.forEach(async (cachedMessages) => {
            await redis.rpush(theOwner, JSON.stringify(cachedMessages));
        });
        if (!deleteMessage) {
            return res.status(404).json({
                msg: `there is no message with id = ${messageId}`,
                success: false,
            });
        }
        res.status(200).json({ success: true, data: deletedMessage });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "internal sever error",
            errorMessage: error.message,
        });
    }
};

module.exports = {
    createMessage,
    getAllMessages,
    updateMessage,
    deleteMessage,
};
