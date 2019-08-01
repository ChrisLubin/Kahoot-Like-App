const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const config = require('config');
const PORT = process.env.PORT || 8080;
const clientURL = config.get('clientRootURL');
const connectDB = require('./db');
const User = require('./models/user');

server.listen(PORT, () => console.log('Server started...'));
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies (POST requests)
app.use((req, res, next) => {
  // Bypass CORS error on client
  res.setHeader('Access-Control-Allow-Origin', clientURL); // Your client root url here
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.use('/join', require('./routes/join'));
app.use('/create', require('./routes/create'));
app.use('/getUsers', require('./routes/getUsers'));

// No routes found for request
app.use((req, res) => {
  res.status(404)
    .json({
      message: "Unknown request"
    });
});

io.on('connection', socket => {
  socket.on('join room', data => {
    socket.join(data.pin, () => {
      const user = new User({
        pin: data.pin,
        username: data.username
      });
      user.save(); // Save to database
      socket.to(data.pin).emit('new player', data.username); // User emits their username to all other users in room
    });
  });
});
