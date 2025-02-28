const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = model("classes", ClassSchema);
