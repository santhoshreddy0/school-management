const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    }
});

module.exports = model('User', UserSchema);