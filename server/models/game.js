const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  gameStarted: Boolean,
  pin: Number,
  questions: {type:[Object]}
});

module.exports = mongoose.model('Game', gameSchema);
