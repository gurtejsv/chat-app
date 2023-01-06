import React, { useEffect, useState } from "react"
import ScrollToBottom from "react-scroll-to-bottom"

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])
  const [userList, setUserList] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      }

      await socket.emit("send_message", messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("")
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })

    socket.on("room_users", ({ users }) => {
      setUserList(users)
    })
  }, [socket])

  return (
    <div className="chat-window">
      <div className="chat-header bg-dark text-light">
        <p className="fw-bold fs-3">Chatroom</p>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-4 border-start border-bottom border-end p-3">
            <div className="chat-sidebar">
              <p className="fw-bold">Room Name</p>
              <p>{room}</p>
              <p className="mt-3 fw-bold">Users ({userList.length})</p>
              <ul>
                {userList.map((userContent) => {
                  return (
                    <li>{userContent.username}</li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="col-8 border-bottom border-end pt-0 px-3 pb-3">
            <div className="chat-body">
              <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                  return (
                    <div
                      className="message"
                      id={username === messageContent.author ? "you" : "other"}
                    >
                      <div>
                        <div className="message-content bg-light text-dark">
                          <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                          <p id="time">{messageContent.time}</p>
                          <p id="author">{messageContent.author}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </ScrollToBottom>
            </div>
            <div className="chat-footer">
              <input
                type="text"
                className="form-control"
                value={currentMessage}
                placeholder="Message..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value)
                }}
                onKeyDown={(event) => {
                  event.key === "Enter" && sendMessage()
                }}
              />
              <button className="btn btn-primary" onClick={sendMessage}>&#9658;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat