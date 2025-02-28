const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const SchoolAdminMappingSchema = new Schema(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("SchoolAdminMapping", SchoolAdminMappingSchema);
