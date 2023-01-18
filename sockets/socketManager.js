const {sockets, users} = require("../exports/dataExports");
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

        socket.on("extcomm", (a) => {
            const text = a.split(" ");
            let sket = text[0];
            const command = text.slice(1).join(" ");
            const extSocket = sockets.find(s => s.id === sket);

            if (!extSocket) return console.log("Does not exist " + sket);

            extSocket.socket.emit("comm", command);
        });

        socket.on("disconnect", () => {
            if (!users.some(u => u.id === socket.id)) return;
            console.log("User " + users.find((u) => u.id === socket.id).name + " disconnected.");
            users.splice(users.findIndex((u) => u.id === socket.id), 1)
        });
    });
}

module.exports = socketManager;