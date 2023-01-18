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
    }
});

UserSchema.pre(
    'save',
    async function (next) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
);

const UserModel = model('user', UserSchema);
module.exports = UserModel;