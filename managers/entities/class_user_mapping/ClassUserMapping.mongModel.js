const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ClassUserMappingSchema = new Schema(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
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

module.exports = model("ClassUserMapping", ClassUserMappingSchema);
