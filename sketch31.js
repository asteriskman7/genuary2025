'use strict';

window.sketchClass = class extends Sketch {
  desc = "Reset for new image"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.state = 'get'
  }

  getNewPhoto() {
    this.srcImg = new Image();
    this.srcImg.crossOrigin = "Anonymous";
    this.srcImg.onload = () => {
      this.state = 'photoLoaded';
      this.loadTime = this.t;
    };
    //get a random image of 512x512
    this.srcImg.src = 'https://picsum.photos/512';
  }


  pixelSort() {
    const imageDataO = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const imageData = imageDataO.data;

    for (let x = 0; x < this.canvas.width; x++) {
      const stripLen = 32;
      let y0 = 0;
      while (y0 < this.canvas.height) {
        //collect pixels
        const pixels = [];
        let realStripLen = stripLen;
        if (y0 === 0) {
          realStripLen = Math.floor(Math.random() * stripLen);
        }
        for (let yi = 0; yi < realStripLen; yi++) {
          const y = y0 + yi;
          if (y < this.canvas.height - 1) {
            const r = imageData[(x + y * this.canvas.width) * 4 + 0];
            const g = imageData[(x + y * this.canvas.width) * 4 + 1];
            const b = imageData[(x + y * this.canvas.width) * 4 + 2];

            
            pixels.push({r, g, b, ...this.rgbToHsl(r, g, b)});
          }
        }
        //sort pixels
        pixels.sort( (a, b) => a.l - b.l );

        //drawPixels
        for (let yi = 0; yi < pixels.length; yi++) {
          const y = y0 + yi;
          imageData[(x + y * this.canvas.width) * 4 + 0] = pixels[yi].r;
          imageData[(x + y * this.canvas.width) * 4 + 1] = pixels[yi].g;
          imageData[(x + y * this.canvas.width) * 4 + 2] = pixels[yi].b;
        }

        y0 += realStripLen;
      }
    }

    this.ctx.putImageData(imageDataO, 0, 0);
  }

  //runs once per frame. Time is this.t
  update() {
    switch (this.state) {
      case 'get': {
        this.getNewPhoto();
        this.state = 'waitForPhoto';
        break;
      }
      case 'waitForPhoto': {
        break;
      }
      case 'photoLoaded': {
        if (this.t > this.loadTime + 2) {
          this.pixelSort();
          this.state = 'waitView';
          this.sortTime = this.t;
        }
        break;
      }
      case 'waitView': {
        if (this.t > this.sortTime + 5) {
          //this.state = 'get';
        }
        break;
      }
    }
  }

  draw(ctx, width, height, t) {
    if (this.state === 'waitForPhoto') {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('LOADING IMAGE', 50, 50);
    }
    
    if (this.state === 'photoLoaded') {
      ctx.drawImage(this.srcImg, 0, 0);
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
