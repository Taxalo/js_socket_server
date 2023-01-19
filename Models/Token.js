const {
    Schema, model
} = require("mongoose");

const TokenSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresIn: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TokenModel = model('token', TokenSchema);
module.exports = TokenModel;