const Message = require('../models/message')

const getAllMessages = (req,res)=>{
    res.status(200).json({msg:"Messages fetched",data:[]})
}
const createMessage = async (req,res)=>{
    req.body.createdBy = req.user.userId;
    req.body.recipientId = req.params.recipientId;
    const message = await Message.create(req.body);
    res.status(201).json({success:true,data:message})
}
const updateMessage = (req,res)=>{
    res.status(200).json({msg:"Message updated"})
}
const deleteMessage = (req,res)=>{
    res.status(200).json({msg:"Message deleted"})
}
module.exports = {
    createMessage,
    getAllMessages,
    updateMessage,
    deleteMessage
}