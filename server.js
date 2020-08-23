const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server);
var users = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/css/index.css", (req, res) => {
  res.sendFile(__dirname + "/css/index.css");
});

io.on("connection", (socket) => {
  let name = "";
  socket.on("has connected", (user) => {
    name = user;
    users.push(user);
    io.emit("has connected", { userName: user, userList: users });
  });

  socket.on("new message", (message) => {
    io.emit("new message", message);
  });

  socket.on("disconnect", () => {
    users.splice(users.indexOf(name), 1);
    io.emit("has disconnected", { userName: name, userList: users });
  });
});

server.listen(3333, () => {
  console.log("Server started at port 3333");
});
