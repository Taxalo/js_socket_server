const express = require("express");
const startDiscord = require("./discord/startDiscord");
const socketManager = require("./sockets/socketManager");
const app = express();
const cors = require("cors");
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