const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const SchoolAdminMappingSchema = new Schema(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("schooladminmappings", SchoolAdminMappingSchema);
