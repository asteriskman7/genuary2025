'use strict';

window.sketchClass = class extends Sketch {
  desc = "Dither me lumers!"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.initImage();
    this.initTime = Infinity;
 
  }

  initImage() {
    const ctx = this.ctx;
    this.emoji = String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 80)); 

    this.drawTargetImage(ctx);

    this.pixelData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.i = 0;
    this.error = 0;
  }

  drawTargetImage(ctx) {
    ctx.fillStyle = 'white';;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = '500px Arial';
    ctx.fillText(this.emoji, -90 , 430);
    
  }

  //runs once per frame. Time is this.t
  update() {
    if (this.t > this.initTime) {
      this.initImage();
      this.initTime = Infinity;
    }
  }

  getImageBrightness(x, y) {
    const imageIndex = (x + y * this.canvas.width) * 4;
    const r = this.pixelData[imageIndex + 0];
    const g = this.pixelData[imageIndex + 1];
    const b = this.pixelData[imageIndex + 2];
    const hsl = this.rgbToHsl(r, g, b);
    return hsl.l;
  }

  draw(ctx, width, height, t) {
    const startTime = (new Date()).getTime();
    const stopTime = startTime + 1000/30;

    while (true) {
      const x = this.i % width;
      const y = Math.floor(this.i / width);
      const brightness = this.getImageBrightness(x, y) / 100;
  
      const preOut = brightness + this.error + Math.random() * 2 ;

      const decision = preOut > 0.5 ? 1 : 0;

      const newError = brightness - decision;
      this.error += newError;

      ctx.fillStyle = decision === 1 ? 'white': 'black';

      ctx.fillRect(x, y, 4, 1);
      this.i += 4;

      const curTime = (new Date()).getTime();
      if (curTime > stopTime) {break;}
    }

    if (this.i > width * height && this.initTime === Infinity) {
      this.initTime = t + 2;
    }
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
