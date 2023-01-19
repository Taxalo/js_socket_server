const {sockets, users, tokenAuthorizations} = require("../exports/dataExports");
const socketCheckToken = require("../middleware/socketCheckToken");
const socketManager = (io) => {
    io.on("connection", (socket) => {

        sockets.push({
            id: socket.id,
            socket: socket
        });

        // Get username - should use query on client

        socket.emit("join", "SEND COMM");

        console.log(`New socket ${socket.id} joined`);

        socket.on("comm", (a) => {
            if (users.some((u) => u.name === a.name)) return;

            users.push({
                id: socket.id,
                name: a.name
            });
            console.log(`Added user ${a.name}.`);
        });

        socket.on("commtoken", async (a) => {
            if (tokenAuthorizations.some((t) => t.token === a.token)) return;
            const res = await socketCheckToken(a.token);
            if (!res) return;

            tokenAuthorizations.push({
                id: socket.id,
                token: a.token
            });

            console.log(`Added token to socket ID ${socket.id}`);
        });

        socket.on("extcomm", async (a) => {
            const token = tokenAuthorizations.find((t) => t.id === socket.id);
            if (!token || !token.id) return;

            const isVerified = await socketCheckToken(token.token);
            if (!isVerified) return;

            const text = a.split(" ");
            let sket = text[0];
            const command = text.slice(1).join(" ");
            const extSocket = sockets.find(s => s.id === sket);

            if (!extSocket) return console.log("Does not exist " + sket);

            extSocket.socket.emit("comm", command);
        });

        socket.on("disconnect", () => {
            if (users.some(u => u.id === socket.id)) {
                console.log("User " + users.find((u) => u.id === socket.id).name + " disconnected.");
                users.splice(users.findIndex((u) => u.id === socket.id), 1)
            }

            if (sockets.some(s => s.id === socket.id)) {
                console.log("Socket " + socket.id + " disconnected.");
                sockets.splice(sockets.findIndex(s => s.id === socket.id), 1);
            }

            if (tokenAuthorizations.some(t => t.id === socket.id)) {
                console.log(`Token of socket ${socket.id} disconnected.`);
                tokenAuthorizations.splice(tokenAuthorizations.findIndex(t => t.id === socket.id), 1);
            }

        });
    });
}

module.exports = socketManager;