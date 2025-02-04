'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.emoji = '\ud83d\uddbc\ufe0f';
    this.initBoxes();
    this.nextSplitTime = 0.1;
    this.minBoxSize = 16;
  }

  initBoxes() {
    this.boxes = [{
      x: 0,
      y: 0,
      w: this.canvas.width,
      h: this.canvas.height,
      c: undefined 
    }];
    this.splitable = [0];
  }

  splitBox(boxIndex) {
    const box = this.boxes[boxIndex];
    const sizeLimit = this.minBoxSize;
    if (Math.random() > 0.5) { 
      //H
      if (box.w <= sizeLimit) {return false;}
      box.w = box.w / 2;
      this.boxes.push({...box, x: box.x + box.w});
    } else {
      //V
      if (box.h <= sizeLimit) {return false;}
      box.h = box.h / 2;
      this.boxes.push({...box, y: box.y + box.h});
    }
    this.colorBox(box);
    this.colorBox(this.boxes[this.boxes.length - 1]);
    return true;
  }

  colorBox(box) {
    const c = this.getAverageColor(box.x, box.y, box.w, box.h);
    box.c = `rgb(${c.r}, ${c.g}, ${c.b})`;
    const hsl = this.rgbToHsl(c.r, c.g, c.b);
    box.o = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l * 0.5}%)`;
  }

  //runs once per frame. Time is this.t
  update() {
    if (this.t >= this.nextSplitTime) {
      const splitIndex = Math.floor(Math.random() * this.splitable.length);
      const boxIndex = this.splitable[splitIndex];
      //const boxIndex = Math.floor(Math.random() * this.boxes.length);
      const split = this.splitBox(boxIndex);
      if (split) {
        this.nextSplitTime = this.t + 0.0;
      }
    }

    this.splitable = [];
    this.boxes.forEach( (b, i) => {
      if (b.w > this.minBoxSize || b.h > this.minBoxSize) {
        this.splitable.push(i);
      }
    });

    if (this.splitable.length === 0) {
      this.initBoxes();
    }
  }

  getAverageColor(x0, y0, w, h) {
    const step = (w > 100 && h > 100) ? 8 : 1;

    let rsum = 0;
    let gsum = 0;
    let bsum = 0;

    let pixelCount = 0;
    for (let x = x0; x < x0 + w; x++) {
      for (let y = y0; y < y0 + h; y++) {
        const r = this.pixelData[(x + this.canvas.width * y) * 4 + 0];
        const g = this.pixelData[(x + this.canvas.width * y) * 4 + 1];
        const b = this.pixelData[(x + this.canvas.width * y) * 4 + 2];
        //const a = this.pixelData[(x + this.canvas.width * y) * 4 + 3];
        rsum += r;
        gsum += g;
        bsum += b;
        pixelCount++;
      }
    }
    return {r: rsum / pixelCount, g: gsum / pixelCount, b: bsum / pixelCount};
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    if (this.boxes.length === 1) {
      ctx.font = '500px Poppins';
      ctx.fillStyle = 'white';
      ctx.fillText(this.emoji, -90, 430);
      this.pixelData = ctx.getImageData(0, 0, width, height).data;
      this.colorBox(this.boxes[0]);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
    } else {
      this.boxes.forEach( b => {
        ctx.fillStyle = b.c;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = b.o;
        ctx.strokeRect(b.x+1, b.y+1, b.w-2, b.h-2);
      });
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
