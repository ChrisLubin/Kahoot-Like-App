const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    gameStarted: Boolean,
    gamePin: Number,
    questions: {type:[Object]}
});

module.exports = mongoose.model('Game', gameSchema);
