const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const SchoolSchema = new Schema(
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
    active: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = model("schools", SchoolSchema);
