const jwt = require('jsonwebtoken');
const Token = require("../Models/Token");
const {secret} = require("../config.json");

const socketCheckToken = async (token) => {
    if (!token) return false;

    try {
        const reqToken = await Token.findOne({
            token
        });

        if (!reqToken || !reqToken.user || hasExpired(reqToken)) return false;

        jwt.verify(token, `${secret}__${reqToken.user}`, (err) => {
            if (err) return false;
        });

    } catch (e) {
        return false;
    }
    return true;
}

const hasExpired = (reqToken) => {
    const now = new Date();
    return now > (reqToken.createdAt + reqToken.expiresIn);
}

module.exports = socketCheckToken;