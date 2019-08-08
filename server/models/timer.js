class Timer {
  constructor(io, room, event, time) {
    this.room = room;
    this.event = event;
    this.start(io, time);
  }

  start(io, time) {
    this.time = time;
    io.in(this.room).emit(this.event, this.time);

    this.timer = setInterval(() => {
      this.time--;

      io.in(this.room).emit(this.event, this.time);

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
