class Timer {
  constructor(io, room, event, time) {
    this.time = time;
    this.start(io, room, event);
  }

  start(io, room, event) {
    io.in(room).emit(event, this.time);

    this.timer = setInterval(() => {
      this.time--;

      io.in(room).emit(event, this.time);

      if (this.time <= 0) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }
}

module.exports = Timer;
