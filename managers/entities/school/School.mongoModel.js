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
  },
  { timestamps: true }
);

module.exports = model("schools", SchoolSchema);
