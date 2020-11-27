const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const { addUser, getUser, getUsersInRoom, removeUser } = require('./users')

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors())

io.on('connection', socket => {

  socket.on('join', ({name, room}, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })

    if (error) return callback({error})

    socket.join(user.room)

    socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to ${user.room}`})
    io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` })

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

    callback({user})
  })

  socket.on('sendMessage', (id, message, callback) => {
    const user = getUser(id);
    console.log(user)
    io.to(user.room).emit('message', { user: user.name, text: message })

    callback()
  })
  
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.emit('message', { user: 'admin', text: `${user.name} has left!` })
      io.emit('roomData', { room: user.room , users: getUsersInRoom(user.room)})
    }
  })
})

app.get('/', (req, res) => {
  res.send({ message: "Ping success!!!" })
})

const PORT = 3001
server.listen(PORT, () => console.log(`Server is started at ${PORT}`))