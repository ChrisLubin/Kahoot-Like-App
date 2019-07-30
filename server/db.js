const mongoose = require('mongoose');
const config = require('config');
const db = config.get("mongoURI");

async function connectDB() {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB;
