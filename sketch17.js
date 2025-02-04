'use strict';

window.sketchClass = class extends Sketch {
  desc = "Proof that Pi = 4"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.lineLength = 1;
    this.lineFraction = 1;
    this.initPoints();
  }

  initPoints() {
    if (this.lineFraction === 512) {
      this.lineLength = 1;
      this.lineFraction = 1;
    }
    this.lineLength = this.lineLength * 0.5;
    this.lineFraction = this.lineFraction * 2;
    this.x = -0.5;
    this.y = 0;
    this.points = [[this.x, this.y]];
    const expectedPointCount = 1 / this.lineLength;
    this.pointDelay = 1 * 2 / expectedPointCount;
    this.nextPoint = this.t + this.pointDelay; 
    this.reset = false;
  }

  //runs once per frame. Time is this.t
  update() {
    if (this.t >= this.nextPoint) {
      if (this.reset) {
        this.initPoints();
      }
      const upx = this.x;
      const upy = this.y - this.lineLength;
      const rightx = this.x + this.lineLength;
      const righty = this.y;

      const upDist = Math.abs(0.5 - Math.sqrt(upx * upx + upy * upy));
      const rightDist = Math.abs(0.5 - Math.sqrt(rightx * rightx + righty * righty));
      if (upDist <= rightDist) {
        this.x = upx;
        this.y = upy;
      } else {
        this.x = rightx;
        this.y = righty;
      }
      this.points.push([this.x, this.y]);

      const doneDist = Math.sqrt(this.x * this.x + (this.y + 0.5) * (this.y + 0.5));

      if (doneDist < this.lineLength * 0.25) {
        this.reset = true;
        this.nextPoint = this.t + 5;
      } else {
        this.nextPoint = this.t + this.pointDelay;
      }
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);
    ctx.scale(400, 400);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.005;
    ctx.beginPath();
    ctx.arc(0, 0, 0.5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'green';
    ctx.beginPath();
    this.points.forEach( (p, i) => {
      if (i === 0) {
        ctx.moveTo(p[0], p[1]);
      } else {
        ctx.lineTo(p[0], p[1]);
      }
    });
    this.points.forEach( (p, i) => {
      if (i === 0) {
        ctx.moveTo(-p[1], p[0]);
      } else {
        ctx.lineTo(-p[1], p[0]);
      }
    });
    this.points.forEach( (p, i) => {
      if (i === 0) {
        ctx.moveTo(-p[0], -p[1]);
      } else {
        ctx.lineTo(-p[0], -p[1]);
      }
    });
    this.points.forEach( (p, i) => {
      if (i === 0) {
        ctx.moveTo(p[1], -p[0]);
      } else {
        ctx.lineTo(p[1], -p[0]);
      }
    });
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = '0.04px Monospace';
    ctx.letterSpacing = '0.001px';
    const c = this.lineLength * (this.points.length - 1) * 4;
    ctx.fillText(`line length= 1/${this.lineFraction}`, -0.63, -0.6);
    ctx.fillText(`line count= ${(this.points.length - 1) * 4}`, -0.63, -0.56);
    ctx.fillText(`circumfrence= ${c}`, -0.63, -0.52);
    ctx.fillText(`diameter= 1`, -0.63, -0.48);
    ctx.fillText(`Pi=c/d= ${c}`, -0.63, -0.44);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
