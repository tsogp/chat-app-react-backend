const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

app.get('/api_example', (req, res) => {
  res.json({
    message: 'hi',
  });
});

http.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    users.push(data);
    socketIO.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});
