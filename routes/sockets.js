const {Router} = require("express");
const router = Router();
const checkToken = require("../middleware/checkToken");
const {users} = require("../exports/dataExports");

router.get("/sockets", checkToken, (_req, res) => {
    res.status(200).json(users);
});

module.exports = router;