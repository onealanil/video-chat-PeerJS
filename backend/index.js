const express = require("express");
const app = express();
const socketIO = require("socket.io");
const http = require("http").createServer(app);

const io = socketIO(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];
let connectedPeer = [];

function addUser(username, socketId) {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
}

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

// establishing the connection
io.on("connection", (socket) => {
  socket.on("addUser", (data) => {
    addUser(data, socket.id);
    io.emit("getUsers", onlineUsers);
  });

  //calling socket
  // for messages
  socket.on("textMessage", ({ sender, receiver, message, senderPeerId }) => {
    const socketIdReceiver = getUser(receiver);
    if (socketIdReceiver) {
      // Send the message to the receiver's socket ID
      io.to(socketIdReceiver.socketId).emit("textMessageFromBack", {
        sender,
        receiver,
        message,
        senderPeerId,
      });
    }

    // Emit the message back to yourself
    socket.emit("textMessageFromBack", {
      sender,
      receiver,
      message,
      senderPeerId,
    });
  });

  // for messages
  socket.on("message", ({ sender, receiver, message }) => {
    const socketIdReceiver = getUser(receiver);
    if (socketIdReceiver) {
      // Send the message to the receiver's socket ID
      io.to(socketIdReceiver.socketId).emit("messageFromBack", {
        sender,
        receiver,
        message,
      });
    }
  });

  socket.on("twoConnectedPeer", ({ peer1, peer2 }) => {
    connectedPeer.push({ peer1, peer2 });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

http.listen(3001, () => {
  console.log("port is connected");
});
