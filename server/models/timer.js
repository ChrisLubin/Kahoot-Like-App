class Timer {
  constructor(io, room, event, time) {
    this.time = time;
    io.in(room).emit(event, this.time);

    this.timer = setInterval(() => {
      this.time--;

      io.in(room).emit(event, this.time);

      if (this.time <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}

module.exports = Timer;
