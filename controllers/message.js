const getAllMessages = (req,res)=>{
    res.status(200).json({msg:"Messages fetched",data:[]})
}
const createMessage = (req,res)=>{
    res.status(201).json({msg:"Message created"})
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