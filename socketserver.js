const express = require("express");
const socket = require("socket.io");
require('dotenv').config();
const PORT = process.env.PORT_SOCKET;

const app = express();

const server = app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`);
});


app.use(express.static("public"));

const io = socket(server);

const activeUsersByGroup = new Map(); 

app.get("/*", (req, res) => {
    const groupName = req.params.group;
    if (!activeUsersByGroup.has(groupName)) {
        activeUsersByGroup.set(groupName, new Set());
    }
    res.sendFile(__dirname + "/public/index.html");
});
io.on("connection", async function (socket) {
    console.log("Connection Created");

    socket.on("new user", function (data) {
        socket.userId = data;
        socket.groupName = data; 
        if (!activeUsersByGroup.has(socket.groupName)) {
            activeUsersByGroup.set(socket.groupName, new Set());
        }
        activeUsersByGroup.get(socket.groupName).add(data); // Add user to the specific group's Set
        io.emit("new user", [...activeUsersByGroup.get(socket.groupName)]);
    });

    socket.on("disconnect", () => {
        const groupName = socket.groupName;
        const userSet = activeUsersByGroup.get(groupName);
        if (userSet) {
            userSet.delete(socket.userId);
            io.emit("user disconnected");
        }
    });

    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });

    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
});
