const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description : {
        type: String,
        required: false,
    }
});

module.exports = model('Role', RoleSchema);