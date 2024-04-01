const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, "Please add a role name"],
      enum: ["admin", "user", "guest"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Role", RoleSchema);
