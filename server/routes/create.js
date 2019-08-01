const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.post('/', async (req, res) => {
  const gameData = req.body;

  try {
    // Request validation
    gameData.forEach(questionObj => {
      if (typeof questionObj.question === "undefined" || typeof questionObj.correctIndex === "undefined") {
        invalidRequestBody(res);
        return;
      }

      questionObj.choices.forEach(choiceObj => {
        if (typeof choiceObj.choice === "undefined") {
          invalidRequestBody(res);
          return;
        }
      });
    });
  } catch(err) {
    invalidRequestBody(res);
    return;
  }

  let randomPin;
  let pinExists = true;

  while (pinExists) {
    randomPin = Math.floor(Math.random()*90000) + 10000;
    pinExists = await Game.findOne({gamePin: randomPin});
  }

  const game = new Game({
    gamePin: randomPin,
    questions: gameData
  });
  await game.save();

  res.status(200)
    .json(randomPin);
});

function invalidRequestBody(res) {
  res.status(400)
    .json({
      message: "Invalid request body."
    });
  return;
}

module.exports = router;
