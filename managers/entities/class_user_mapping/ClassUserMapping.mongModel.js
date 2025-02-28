const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ClassUserMappingSchema = new Schema(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "classes",
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

module.exports = model("classusermappings", ClassUserMappingSchema);
