const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const RolePermissionMappingSchema = new Schema(
  {
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission_id: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("RolePermissionMapping", RolePermissionMappingSchema);
