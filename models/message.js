const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide sender id"],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide recipient id"],
    },
    messageContent: {
      type: String,
      required: [true, "please provide message content"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
