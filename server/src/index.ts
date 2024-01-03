import express from 'express'
import { Server } from "socket.io"
import cors from 'cors'

const PORT = process.env.PORT || 3500
const app = express()

app.use(cors())

const expressServer = app.listen(PORT, () => console.log(`listening on: ${PORT}`))

const io = new Server(expressServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  socket.emit('welcome', `Welcome, ${socket.id.slice(0, 5)}!`);

  socket.broadcast.emit('user_joined', `User, ${socket.id.slice(0, 5)} joined!`);

  socket.on('newMsg', (data) => {
    io.emit('newMsg', { message: data.message, sender: socket.id.slice(0, 5) });
  });

  socket.on('activity', () => {
    socket.broadcast.emit('activity', `${socket.id.slice(0, 5)} is typing!`);
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user_disconnected', `User ${socket.id.slice(0, 5)} disconnected`);
  });

});
