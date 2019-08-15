const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.get('/:pin', async (req, res) => {
  const pin = req.params.pin;
  const regex = /^[0-9]*$/;

  // Validation checks
  if (pin.length !== 5) {
    res.status(422).json({
      message: `${pin} is not a valid game pin. It has to be 5 integers long.`,
      length: pin.length
    });
    return;
  } else if (!pin.match(regex)) {
    res.status(422).json({
      message: `${pin} is not a valid game pin. It should only contain integers.`,
      length: pin.length
    });
    return;
  }

  // Query database
  const game = await Game.findOne({ pin: pin }).lean();

  if (!game) {
    res.status(404).json({
      message: `Game with a pin of ${pin} was not found.`,
      length: pin.length
    });
    return;
  }

  // Remove correct answers from questions so client doesn't have it until all users answer question
  game.questions.forEach(question => delete question.correctIndex);

  // Send response with game questions & choices
  game.currentQuestionIndex = 0;
  res.status(200).json({
    message: 'Join successful.',
    length: pin.length,
    game: game
  });
});

module.exports = router;
