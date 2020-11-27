import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from 'axios';

const ENDPOINT = 'http://localhost:3001/'
const App = (props) => {
  const socket = io(ENDPOINT, {
    withCredentials: true,
  });

  const [ messages, setMessages] = useState([])

  const [ currentUser, setCurrentUser ] = useState(null)
  const [ users, setUsers ] = useState('')
  const [ isJoined, setIsJoined ] = useState(false)

  useEffect(() => {
    axios.get(ENDPOINT).then((result) => {
      console.log(result.data);
    });

    socket.on("message", (message) => {
      console.log([...messages, message]);
      setMessages((messages) => [...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users)
    })
  }, [])

  const join = (event) => {
    event.preventDefault()
    socket.emit('join', ({ name: event.target.name.value, room: event.target.room.value }), ({error, user}) => {
      if (error) alert(error)
      else {
        setIsJoined(true);
        setCurrentUser(user)
      }
    })
  }

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", currentUser.id, event.target.message.value, (error) => {
      console.log(error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <body className="App-body">
        {!isJoined ? (
          <form onSubmit={join}>
            <label>
              Name <input name="name" />
            </label>
            <label>
              Room <input name="room" />
            </label>
            <button type="submit">Join</button>
          </form>
        ) : (
          <div>
            {messages.map((m, i) => (
              <p key={i}>
                {m.user} : {m.text}
              </p>
            ))}
            <form onSubmit={sendMessage}>
              <input
                name="message"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </body>
    </div>
  );
};

export default App;
