const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const RolePermissionMappingSchema = new Schema(
  {
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
    permission_id: {
      type: Schema.Types.ObjectId,
      ref: "permissions",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("rolepermissionmappings", RolePermissionMappingSchema);
