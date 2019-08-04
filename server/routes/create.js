const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.post('/', async (req, res) => {
  const gameData = req.body;

  try {
    // Request validation
    gameData.forEach(questionObj => {
      if (typeof questionObj.question === "undefined" || typeof questionObj.correctIndex === "undefined") {
        throw new Error("Question or correctIndex property not present.");
      }

      if (questionObj.choices.length !== 4) {
        throw new Error("The amount of choices was not 4.");
      }
      
      const invalid = questionObj.choices.some(choice => typeof choice !== "string" || !choice);

      if (invalid) {
        throw new Error("All choices were not strings or a choice was an empty string.");
      }
    });
  } catch(err) {
    invalidRequestBody(res, err.message);
    return;
  }

  let randomPin;
  let pinExists = true;

  while (pinExists) {
    randomPin = Math.floor(Math.random()*90000) + 10000;
    pinExists = await Game.findOne({ pin: randomPin });
  }

  const game = new Game({
    gameStarted: false,
    currentQuestionIndex: 0,
    pin: randomPin,
    questions: gameData
  });
  await game.save();

  res.status(200)
    .json(game);
});

function invalidRequestBody(res, message) {
  res.status(400)
    .json({
      message: message
    });
  return;
}

module.exports = router;
