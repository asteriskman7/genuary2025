'use strict';

window.sketchClass = class extends Sketch {
  desc = "It's like an onion but more crying."; // jshint ignore:line

  load() {

  }

  update() {
    //time is this.t in seconds
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(0, 0%, 20%)';
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i = i + 1) {
      const l = this.lmap(this.pnoise(this.t * 3+ 6534 + i * 2443, i * 5423 + 642), 0, 1, 30, 90);
      ctx.fillStyle = `hsl(0, 0%, ${l}%)`;
      const starx = this.lmap(this.rnd(434 + i * 2343), 0, 1, -width / 2, width / 2);
      const stary = this.lmap(this.rnd(235 + i * 1877), 0, 1, -height / 2, height / 2);
      ctx.fillRect(starx, stary, 2, 2);
    }

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(0, 0, 220, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    let i = 0;
    const drx = 20;
    const dry = 40;
    const speed = 10;
    const f = this.t % 1;
    while (true) {
      let rx = 100 - drx * (i - f);
      let ry = 200 - dry * (i - f);

      if (ry < 0) {break;}

      if (i === 0) {
        rx = 100;
        ry = 200;
      }

      //const h = ry * 360 / 200;
      const h = (Math.floor(this.t) + i) * 360 / 20;

      ctx.fillStyle = `hsl(${h}, 50%, 30%)`;
      if (rx >= 0) {
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, Math.PI / 2, 3 * Math.PI / 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = `hsl(${h}, 50%, 50%)`;
      ctx.beginPath(); 
      ctx.ellipse(0, 0, ry, ry, 0, 3 * Math.PI / 2, 5 * Math.PI / 2);
      ctx.fill();
      ctx.stroke();
      
      i = i + 1;
    }

    ctx.beginPath();
    ctx.moveTo(0, -200);
    ctx.lineTo(0, 200);
    ctx.stroke();
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
