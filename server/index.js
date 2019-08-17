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
const GameKeeper = require('./models/gameKeeper');
const games = {}; // Active games

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
app.use('/create', require('./routes/create'));
app.use('/didGameStart', require('./routes/didGameStart'));
app.use('/getUsers', require('./routes/getUsers'));
app.use('/join', require('./routes/join'));

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
      if (!data.username) {
        // Host created game
        games[data.pin] = new GameKeeper(io, data, games);
        return;
      }

      games[data.pin].playerJoined();
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

  // Host starts game
  socket.on('game start', async gamePin => {
    const pin = gamePin;
    
    // Update 'gameStarted' property in DB
    await Game.findOneAndUpdate({ pin: pin }, { gameStarted: true }, { useFindAndModify: false });
    games[pin].startGame();
  });

  socket.on('answered question', data => {
    const pin = data.pin;
    games[pin].questionAnswered(socket, data);
  });

  socket.on('disconnecting', async () => {
    const rooms = Object.keys(socket.rooms);

    if (rooms.length === 1) { return } // Do nothing because this is the first test connect socket from client

    const pin = rooms[0];
    let result = await User.findOne({ id: socket.id }).select('username');

    if (!result) {
      // Host disconnected
      try {
        games[pin].hostLeft();
      } catch(err) {
        // GameKeeper object no longer exists because all players left
        return;
      }

      result = await Game.findOne({ pin: pin }).select('gameStarted');
      const gameStarted = result.gameStarted;

      if (gameStarted) {
        // Do nothing because game already started
        return;
      }
      
      // Game was not started
      socket.to(pin).emit('host left');
      await Game.deleteOne({ pin: pin });
      return;
    }

    try {
      games[pin].playerLeft();
    } catch (err) {
      // GameKeeper object on longer exists because game ended
    }

    const username = result.username;
    socket.to(pin).emit('player left', username);
    await User.deleteOne({ id: socket.id });
  });
});
