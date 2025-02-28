const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const PermissionSchema = new Schema(
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
  },
  { timestamps: true }
);

module.exports = model("Permission", PermissionSchema);
