const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: String,
    pin: String,
    username: String
});

module.exports = mongoose.model('User', userSchema);
