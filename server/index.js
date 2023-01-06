const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join_room", ({ username, room }) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    console.log(`User with ID: ${socket.id} joined room: ${room}`)

    io.to(user.room).emit("room_users", {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    const user = userLeave(socket.id)

    console.log("User Disconnected", socket.id)

    if (user) {
      io.to(user.room).emit("room_users", {
        room: user.room,
        users: getRoomUsers(user.room),
      })
    }
  })
})

server.listen(3001, () => {
  console.log("SERVER RUNNING")
})