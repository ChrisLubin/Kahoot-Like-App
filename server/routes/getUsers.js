const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/:pin', async (req, res) => {
    const pin = req.params.pin;
    const users = await User.find({pin: pin}).select('username');
    res.send(users);
});

module.exports = router;
