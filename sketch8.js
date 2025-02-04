'use strict';

window.sketchClass = class extends Sketch {
  desc = "1 million milliseconds = 16 2/3 minutes"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.initTimes();
  }

  initTimes() {
    const curTime = new Date();
    this.startTime = curTime.getTime();
    this.startText = this.addMsToTimeText(curTime.toString(), this.startTime);
    const endTime = new Date(this.startTime + 1000000);
    this.endText = this.addMsToTimeText(endTime.toString(), endTime.getTime());
  }

  addMsToTimeText(text, time) {
    const textSplit = text.split(' ');
    const timeMs = time % 1000;
    textSplit[4] += `.${timeMs.toString().padStart(3, '0')}`;
    return textSplit.join(' ');
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    const curDate = new Date();
    const curTime = curDate.getTime();
    const deltaTime = Math.floor((curTime - this.startTime));
    const curTimeText = this.addMsToTimeText(curDate.toString(), curTime);
   

    let i = 0;
    let lastX = 0;
    let lastY = 0;
    for (let y = 0; y < 500; y++) {
      for (let x = 0; x < 500; x++) {
        if ((i * 4) <= deltaTime) {
          ctx.fillStyle = 'red';
          lastX = x;
          lastY = y;
        } else {
          ctx.fillStyle = 'green';
        }
        ctx.fillRect(x, y, 1, 1);
        i++;
      }
    }

    ctx.fillStyle = 'white';
    ctx.font = '10px Monospace';
    ctx.fillText(this.startText, 10, 20);
    ctx.textAlign = 'right';
    ctx.fillText(this.endText, 490, 490);
    ctx.textAlign = 'center';
    ctx.fillText(curTimeText, 250, 250);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(9, 15);
    ctx.moveTo(490, 490);
    ctx.lineTo(500, 500);
    ctx.moveTo(250, 250);
    ctx.lineTo(lastX, lastY);
    ctx.stroke();

    if (deltaTime >= 1000000) {
      this.initTimes();
    }
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
