const multer = require('multer');
const {Router} = require("express");
const {Webhook} = require("discord-webhook-node");
const {webhook, discordEnabled} = require("../config.json");
const router = Router();
const hook = new Webhook(webhook);
const checkToken = require("../middleware/checkToken");
const fs = require("fs");

// https://medium.com/swlh/how-to-implement-image-upload-using-express-and-multer-postgresql-c6de64679f2

const imageUpload = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, 'images/');
            },
            filename: function (req, file, cb) {
                cb(
                    null,
                    new Date().valueOf() +
                    '_' +
                    file.originalname
                );
            }
        }
    ),
});

router.get("/images", checkToken, (_req, res) => {
    const images = fs.readdirSync("images").filter(f => f.endsWith(".png"));
    res.status(200).json(images[images.length - 1]);
});

router.post("/image", imageUpload.single("ss"), async (req, res) => {
    if (discordEnabled) await hook.sendFile(`./images/${req.file.filename}`);
    res.sendStatus(200);
});

module.exports = router;