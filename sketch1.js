'use strict';

window.sketchClass = class extends Sketch {
  desc = "Easter string art?"; // jshint ignore:line

  load() {
    this.index = 0;
    this.dir = 0;
    this.h = 0;
  }

  update() {
    //time is this.t in seconds
    this.index = (this.index + 1) % this.canvas.width;
    if (this.index === 0) {
      this.dir = (this.dir + 1) % 4;
    }
  }

  draw(ctx, width, height, t) {


    const vert = Math.random() > 0.5;
    const c = `hsl(${this.h}, 50%, 50%)`;
    this.h++;
    ctx.strokeStyle = c;

    ctx.beginPath();
    switch (this.dir) {
      case 0: {
        if (vert) {
          ctx.moveTo(this.index, 0);
          ctx.lineTo(this.index, height);
        } else {
          ctx.moveTo(0, this.index);
          ctx.lineTo(width, this.index);
        }
        break;
      }
      case 1: {
        if (vert) {
          ctx.moveTo(width - this.index, 0);
          ctx.lineTo(width - this.index, height);
        } else {
          ctx.moveTo(0, this.index);
          ctx.lineTo(width, this.index);
        }
        break;
      } 
      case 2: {
        if (vert) {
          ctx.moveTo(width - this.index, 0);
          ctx.lineTo(width - this.index, height);
        } else {
          ctx.moveTo(0, height - this.index);
          ctx.lineTo(width, height - this.index);
        }
        break;
      }
      case 3: {
        if (vert) {
          ctx.moveTo(this.index, 0);
          ctx.lineTo(this.index, height);
        } else {
          ctx.moveTo(0, height - this.index);
          ctx.lineTo(width, height - this.index);
        }
        break;
      }
    }
    ctx.stroke();
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
