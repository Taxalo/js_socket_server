const jwt = require('jsonwebtoken');
const Token = require("../Models/Token");
const {secret} = require("../config.json");

const checkToken = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).send({
        msg: "No token, authorization denied"
    });

    try {
        const reqToken = await Token.findOne({
            token
        });

        if (!reqToken || !reqToken.user || hasExpired(reqToken)) {
            return res.status(401).send({
                msg: "Unauthorized"
            });
        }

        jwt.verify(token, `${secret}__${reqToken.user}`, (err) => {
            if (err) return res.status(400).send({
                msg: "Invalid token"
            });
        });
    } catch (e) {
        res.status(400).send({
            msg: "Invalid token"
        });
        return;
    }
    next();
}

const hasExpired = (reqToken) => {
    const now = new Date();
    return now > (reqToken.createdAt + reqToken.expiresIn);
}

module.exports = checkToken;