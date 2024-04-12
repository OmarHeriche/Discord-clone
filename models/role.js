const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, "Please add a role name"],
      enum: ["admin", "user", "guest","omar🫡"],
      default: "user",
      unique: true,
    },
  },
  { timestamps: true }
);

RoleSchema.statics.getEnumValues = function() {
  return this.schema.path('roleName').enumValues;
}

module.exports = mongoose.model("Role", RoleSchema);
