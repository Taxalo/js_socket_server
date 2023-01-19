const express = require("express");
const startDiscord = require("./discord/startDiscord");
const socketManager = require("./sockets/socketManager");
const app = express();
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const {mongoURI} = require("./config.json");
app.use(express.json());
app.use(cors({
    origin: "*"
}));

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    maxHttpBufferSize: 1e7
});

const port = process.env.PORT || 4122;

if (!fs.existsSync("images")) fs.mkdirSync("images");

app.use("/imgs", express.static("images"));

app.use("/", require("./routes/user"));
app.use("/", require("./routes/sockets"));
app.use("/", require("./routes/images"));
app.use("/", require("./routes/others"));

socketManager(io)
startDiscord();

http.listen(port, () => {
    console.log(`Socket.IO server running at https://localhost:${port}/`);
});

mongoose.connect(mongoURI);