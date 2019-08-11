class GameKeeper {
  constructor(io, game) {
    this.io = io;
    this.game = game;
    this.pin =  game.pin;
    this.currentQuestion = this.game.questions[0];
    this.currentQuestionIndex = 0;
    this.playerCount = 0;
    this.playersAnswered = 0;
  }

  playerJoined() {
    this.playerCount++;
  }

  playerLeft() {
    this.playerCount--;
  }

  startGame(socket) {
    socket.to(this.pin).emit('game start');
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

  nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex === this.game.questions.length) {
      // All questions have been asked
      this.io.in(this.pin).emit('game over');
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
