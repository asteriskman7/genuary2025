'use strict';

window.sketchClass = class extends Sketch {
  desc = "Vroom vroom!"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.ctx.fillStyle = 'hsl(228, 100%, 38%)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    const drawType = Math.floor(Math.random() * 4);
    ctx.rotate(Math.PI / 4);
    const x = this.lmap(Math.random(), 0, 1, -width / 2, 3 * width / 2);
    const y = this.lmap(Math.random(), 0, 1, -height, 3 * height / 2);
    const w = this.lmap(Math.random(), 0, 1, 10, 100);
    const h = w;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    switch (drawType) {
      case 0: {
        //dark blue filled rectangle
        ctx.fillStyle = 'hsl(228, 100%, 20%)';
        ctx.fillRect(x, y, w, h);
        break;
      }
      case 1: {
        //light blue filled and dark stroked rectangle
        ctx.fillStyle = 'hsl(228, 100%, 70%)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'hsl(228, 100%, 10%)';
        ctx.strokeRect(x, y, w, h);
        break;
      }
      case 2: {
        //yellow stroked rectangle
        ctx.strokeStyle = 'hsl(53, 100%, 54%)';
        ctx.strokeRect(x, y, w, h);
        break;
      }
      case 3: {
        //yellow dotted stroked rectangle
        ctx.strokeStyle = 'hsl(53, 100%, 54%)';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);
        break;
      }
    }
    ctx.strokeRect(-width / 2, -height, 2 * width, 2 * height);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
