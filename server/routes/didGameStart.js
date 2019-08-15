const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.get('/:pin', async (req, res) => {
  const pin = req.params.pin;
  const result = await Game.findOne({ pin: pin }).select('gameStarted');
  let gameStarted;

  try {
    gameStarted = result.gameStarted;
  } catch (err) {
    // Game no longer exists
    res.send(true);
    return;
  }

  if (gameStarted) {
    res.send(true);
    return;
  }

  res.send(false);
});

module.exports = router;
