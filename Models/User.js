const {
    Schema, model
} = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre(
    'save',
    async function (next) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
);

const UserModel = model('user', UserSchema);
module.exports = UserModel;