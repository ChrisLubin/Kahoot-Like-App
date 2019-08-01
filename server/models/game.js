const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    gamePin: Number,
    questions: {type:[Object]}
});

module.exports = mongoose.model('Game', gameSchema);
