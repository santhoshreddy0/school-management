const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("classrooms", ClassSchema);
