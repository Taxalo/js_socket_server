const {Router} = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Token = require("../Models/Token");
const jwt = require("jsonwebtoken");
const {secret} = require("../config.json");
const checkToken = require("../middleware/checkToken");

router.post("/register", async (req, res) => {
    const {user, password} = req.body;

    if (!user || !password) return res.status(400).json({
        success: false,
        message: "You need to specify an user and a password"
    });

    const reqUser = await User.findOne({
        user
    });

    if (reqUser) return res.status(400).json({
        success: false,
        message: "There is already an user with that username"
    });

    try {
        const newUser = new User({
            user,
            password
        });

        await newUser.save();

        const token = await generateToken(user);

        res.status(200).json({
            success: true,
            token
        });

    } catch (e) {
        res.status(400).json({
            success: false,
            message: "There has been an error while saving the user"
        });
    }
});

router.post("/login", async (req, res) => {
    let {user, password} = req.body;

    if (!user || !password) return res.status(400).json({
        success: false,
        message: "You need to specify an user and a password"
    });

    const reqUser = await User.findOne({
        user
    });

    if (!reqUser) return res.status(400).json({
        status: false,
        message: "There is not an user with that name"
    });

    const comparePassword = await bcrypt.compare(password, reqUser.password);

    if (!comparePassword) return res.status(400).json({
        success: false,
        message: "The password is incorrect"
    });

    const token = await generateToken(user);

    res.status(200).json({
        success: true,
        token: token
    });
});

router.get("/auth", checkToken, async (req, res) => {
    res.status(200).send({
        success: true,
        message: "You are authorized"
    });
});

async function generateToken(user) {
    const expiration = Math.floor(Date.now() / 1000) + 3600
    const token = jwt.sign({
        user
    }, `${secret}__${user}`, {
        expiresIn: expiration
    });

    const newToken = new Token({
        user,
        token,
        expiresIn: expiration
    });

    await newToken.save();

    return token;
}

module.exports = router;