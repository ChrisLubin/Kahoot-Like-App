const Game = require('../models/game');
const User = require('../models/user');

class GameKeeper {
  constructor(io, game, games) {
    this.io = io;
    this.games = games;
    this.game = game;
    this.game.hostLeft = false;
    this.pin =  game.pin;
    this.currentQuestion = this.game.questions[0];
    this.currentQuestionIndex = 0;
    this.playerCount = 0;
    this.playersAnswered = 0;
  }

  hostLeft() {
    this.game.hostLeft = true;
  }

  playerJoined() {
    this.playerCount++;
  }

  async playerLeft() {
    this.playerCount--;
    if (this.playerCount === 0 && (this.game.gameStarted || this.game.hostLeft)) {
      if (this.game.gameStarted) {
        // Let host know that all players left
        console.log('Everyone except the host left'); 
      }

      this.stopTimer();
      await Game.deleteOne({ pin: this.pin });
      await User.deleteMany({ pin: this.pin });
      delete this.games[this.pin];
    }
  }

  startGame() {
    this.game.gameStarted = true;
    this.io.in(this.pin).emit('game start');
    this.startTimer(30);
  }

  startTimer(time) {
    this.correctAnswer = this.currentQuestion.correctIndex;
    this.time = time;
    this.io.in(this.pin).emit('time left', this.time);

    this.timer = setInterval(() => {
      this.time--;

      this.io.in(this.pin).emit('time left', this.time);

      if (this.time <= 0) {
        this.stopTimer();
        this.io.in(this.pin).emit('correct answer', this.correctAnswer);
        this.playersAnswered = 0; // Reset counter
        this.nextQuestion();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  questionAnswered(socket, data) {
    this.playersAnswered++;

    socket.to(this.pin).emit('answered question', {
      username: data.username,
      answerIndex: data.answerIndex
    });

    if (this.playerCount === this.playersAnswered) {
      this.stopTimer();
      this.io.in(this.pin).emit('all players answered', this.currentQuestion.correctIndex);
      this.playersAnswered = 0; // Reset counter
      this.nextQuestion();
    }
  }

  async nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex === this.game.questions.length) {
      // All questions have been asked
      this.io.in(this.pin).emit('game over');
      await Game.deleteOne({ pin: this.pin });
      delete this.games[this.pin];
      return;
    }
    this.currentQuestion = this.game.questions[this.currentQuestionIndex];

    // Give players time between questions
    setTimeout(() => {
      this.io.in(this.pin).emit('next question');
      this.startTimer(30);
    }, 4000);
  }
}

module.exports = GameKeeper;
