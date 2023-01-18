const {Router} = require("express");
const router = Router();

router.get("/sockets", (_req, res) => {
    res.status(200).json(users);
});

module.exports = router;