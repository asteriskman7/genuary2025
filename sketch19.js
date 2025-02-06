'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.s = 8;
    this.w = this.canvas.width / this.s;
    this.h = this.canvas.height / this.s;
    this.balls = [
    ];

    const ballCount = 6;

    for (let i = 0; i < ballCount; i++) {
      const r = this.lmap(Math.random(), 0, 1, 5, 10);
      this.balls.push({
        r,
        x: this.lmap(Math.random(), 0, 1, r, this.w - r),
        y: this.lmap(Math.random(), 0, 1, r, this.h - r),
        vx: this.lmap(Math.random(), 0, 1, -0.5, 0.5),
        vy: this.lmap(Math.random(), 0, 1, -0.5, 0.5)
      });
    }
  }

  //runs once per frame. Time is this.t
  update() {
    this.balls.forEach( b => {
      b.x += b.vx;
      b.y += b.vy;

      if (b.x - b.r < 0) {
        b.x = b.r;
        b.vx *= -1;
      }
      if (b.x + b.r >= this.w) {
        b.x = this.w - 1 - b.r;
        b.vx *= -1;
      }
      if (b.y - b.r < 0) {
        b.y = b.r;
        b.vy *= -1;
      }
      if (b.y + b.r >= this.h) {
        b.y = this.h - 1 - b.r;
        b.vy *= -1;
      }
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {

        let inv = false;
        let count = 0;

        this.balls.forEach( b => {
          const dx = x - b.x;
          const dy = y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < b.r) {
            inv = !inv;
            count++;
          }
        });

        if (inv) {
          ctx.fillStyle = (y % 4) % 2 === 0 ? 'black' : 'white';
        } else {
          ctx.fillStyle = (y % 4) % 2 === 0 ? 'white' : 'black';
        }
        ctx.fillRect(x * this.s, y * this.s, this.s, this.s);
      }
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
