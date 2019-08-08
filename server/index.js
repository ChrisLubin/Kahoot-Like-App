const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const config = require('config');
const PORT = process.env.PORT || 8080;
const clientURL = config.get('clientRootURL');
const connectDB = require('./db');
const Game = require('./models/game');
const User = require('./models/user');
const Timer = require('./models/timer');

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

// Temporary
app.use('/delete', async (req, res) => {
  await User.deleteMany();
  await Game.deleteMany();
  res.status(200)
    .json("Deleted");
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
    socket.join(data.pin, () => {
      if (!data.username) { return } // Host just wants to listen for players joining

      const username = data.username.trim().replace(/\s+/g,' '); // Remove excess spaces
      const user = new User({
        id: socket.id,
        pin: data.pin,
        username: username
      });
      user.save(); // Save to database
      socket.to(data.pin).emit('new player', username); // User emits their username to all other users in room
    });
  });

  socket.on('game start', async gamePin => {
    // Update 'gameStarted' property in DB
    await Game.findOneAndUpdate({ pin: gamePin }, { gameStarted: true }, { useFindAndModify: false });
    socket.to(gamePin).emit('game start');

    new Timer(io, gamePin, 'time left', 30);
  });

  socket.on('correct answer', data => {
    const pin = data.pin;
    socket.to(pin).emit('correct answer', data.correctAnswer);
  });

  socket.on('answered question', data => {
    const pin = data.pin;

    socket.to(pin).emit('answered question', {
      username: data.username,
      answerIndex: data.answerIndex
    });
  });

  socket.on('disconnecting', async () => {
    const rooms = Object.keys(socket.rooms);

    if (rooms.length === 1) { return } // Do nothing because this is the first test connect socket from client

    const pin = rooms[0];
    const result = await User.findOne({ id: socket.id }).select('username');

    if (!result) { return } // Host disconnected

    const username = result.username;
    socket.to(pin).emit('player left', username);
    await User.deleteOne({ id: socket.id }); // Doesn't work without await for some reason
  });
});
