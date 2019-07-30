const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;
const users = []; // Temporary

server.listen(PORT, () => console.log('Server started...'));

// Middleware
app.use((req, res, next) => {
  // Bypass CORS error on client
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200'); // Your client root url here
  next();
});

// Routes
app.use('/join', require('./routes/join'));
app.use('/getUsers', (req, res) => {
  res.send(users);
});

// No routes found for request
app.use((req, res) => {
  res.status(404)
    .json({
      message: "Unknown request"
    });
});

io.on('connection', socket => {
  socket.on('join room', data => {
    console.log('User connected...');
    socket.join(data.pin, () => {
      users.push(data.username);
      socket.to(data.pin).emit('new player', data.username); // User emits their username to all other users in room
    });
  });
});
