const {Router} = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../Models/User");


router.post("/register", async (req, res) => {
    const {user, password} = req.body;
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
        res.status(200).json({
            success: true,
            token: token
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
        message: "Specify an user and a password" 
    });

    const reqUser = await User.findOne({
        user
    });

    if (!reqUser) return res.status(400).json({
        status: false,
        message: "There is not an user with that name"
    });

    password = await bcrypt.hash(password, 10);

    if (reqUser.password !== password) return res.status(400).json({
        success: false,
        message: "The password is incorrect"
    });

    const token = await generateToken(user);

    res.status(200).json({
        success: true,
        token: token
    });
});

async function generateToken(user) {
    return await jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 3600,
        data: {
            user
        }
      }, 'SECRETO123'); // TODO: USAR SECRETO + BPUSER
}

module.exports = router;