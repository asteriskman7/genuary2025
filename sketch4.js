'use strict';

window.sketchClass = class extends Sketch {
  desc = "on black on black on black ..."; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.sin(t * 0.5));
    ctx.globalAlpha = 0.75;
    ctx.drawImage(this.canvas, -width / 2 - 10, -height / 2 - 10, width + 20, height + 20);
    ctx.restore();

    ctx.fillStyle = 'black';
    ctx.fillRect(200,200, 100, 10);
    ctx.fillRect(210,400, 100, 10);
    ctx.fillRect(310,200, 10, 200);
    ctx.fillRect(190,210, 10, 200);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
