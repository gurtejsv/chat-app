// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min"

import "./App.css"

import io from "socket.io-client"
import { useState } from "react"
import Chat from "./Chat"

const socket = io.connect("http://localhost:3001")

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (!/^[a-z0-9]+$/.test(username)) {
      return
    }

    if (!/^[a-z0-9]+$/.test(room)) {
      return
    }

    socket.emit("join_room", { username, room })
    setShowChat(true)
  }

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3 className="fw-bold">Join Chatroom</h3>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.target.value)
            }}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value)
            }}
          />
          <button className="btn btn-primary" onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  )
}

export default App