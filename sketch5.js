'use strict';

window.sketchClass = class extends Sketch {
  desc = "Sometimes it's tough to get perspective on a situation"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.cubes = {};
    this.nextCut = 1;
    this.initCubes();
  }

  initCubes() {
    this.cutCount = 0;
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        for (let z = 0; z < 10; z++) {
          this.cubes[`${x},${y},${z}`] = true;
        }
      }
    }
  }

  //runs once per frame. Time is this.t
  update() {
    if (this.t > this.nextCut) {
      this.nextCut = this.t + 1;
      if (this.cutCount > 10) {
        this.initCubes();
        return;
      }

      let minx = 0;
      let miny = 0;
      let minz = 0;
      let maxx = 10;
      let maxy = 10;
      let maxz = 10;
      switch (Math.floor(Math.random() * 3)) {
        case 0: {
          //xy
          minz = Math.floor(Math.random() * 10);
          maxz = minz + 1;
          break;
        }
        case 1: {
          miny = Math.floor(Math.random() * 10);
          maxy = miny + 1;
          //xz
          break;
        }
        case 2: {
          //yz
          minx = Math.floor(Math.random() * 10);
          maxx = minx + 1;
          break;
        }
      }
      let anyCut = false;
      for (let x = minx; x < maxx; x++) {
        for (let y = miny; y < maxy; y++) {
          for (let z = minz; z < maxz; z++) {
            anyCut = anyCut || this.cubeExists(x, y, z);
            this.cubes[`${x},${y},${z}`] = false;
          }
        }
      }
      if (!anyCut) {
        this.nextCut = 0;
      } else {
        this.cutCount++;
      }
    }
  }

  flattenPoint(x, y, z) {
    const cx0 = -170;
    const cy0 = 100;
    const gridSize = 20;
    const cx = cx0 + x * gridSize * Math.cos(Math.PI / 6) + y * gridSize * Math.cos(Math.PI / 6);
    const cy = cy0 + x * gridSize * Math.sin(Math.PI / 6) - y * gridSize * Math.sin(Math.PI / 6) - gridSize * z;
    return {x: cx, y: cy};
  }

  drawLine(ctx, x0, y0, z0, x1, y1, z1) {
    const cx0 = this.flattenPoint(x0, y0, z0);
    const cx1 = this.flattenPoint(x1, y1, z1);
    ctx.moveTo(cx0.x, cx0.y);
    ctx.lineTo(cx1.x, cx1.y);
  }

  drawFace(ctx, x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    const cx0 = this.flattenPoint(x0, y0, z0);
    const cx1 = this.flattenPoint(x1, y1, z1);
    const cx2 = this.flattenPoint(x2, y2, z2);
    const cx3 = this.flattenPoint(x3, y3, z3);
    ctx.moveTo(cx0.x, cx0.y);
    ctx.lineTo(cx1.x, cx1.y);
    ctx.lineTo(cx2.x, cx2.y);
    ctx.lineTo(cx3.x, cx3.y);
    ctx.lineTo(cx0.x, cx0.y);
  }

  cubeExists(x, y, z) {
    return this.cubes[`${x},${y},${z}`];
  }

  drawCube(ctx, x, y, z) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${z * 300 / 10}, ${x * 100 / 10}%, ${y * 80 / 10 + 20}%)`;
    this.drawFace(ctx, x + 0, y + 0, z + 0,
                       x + 0, y + 0, z + 1,
                       x + 1, y + 0, z + 1,
                       x + 1, y + 0, z + 0);
    this.drawFace(ctx, x + 1, y + 0, z + 0,
                       x + 1, y + 0, z + 1,
                       x + 1, y + 1, z + 1,
                       x + 1, y + 1, z + 0);
    this.drawFace(ctx, x + 0, y + 0, z + 1,
                       x + 0, y + 1, z + 1,
                       x + 1, y + 1, z + 1,
                       x + 1, y + 0, z + 1);
    ctx.fill();

    ctx.beginPath();
    /*
        /\
      7/  \8
      /    \
      \    /
      |\56/|
     2| \/ |4
      |  | |
      \ 3| /
      0\ |/1
        \/
    */
    if (!this.cubeExists(x, y, z - 1)) {
      this.drawLine(ctx, x + 0, y + 0, z + 0, x + 1, y + 0, z + 0); //0
    }
    if (!this.cubeExists(x, y, z - 1)) {
      this.drawLine(ctx, x + 1, y + 0, z + 0, x + 1, y + 1, z + 0); //1
    }
    if (!this.cubeExists(x - 1, y, z)) {
      this.drawLine(ctx, x + 0, y + 0, z + 0, x + 0, y + 0, z + 1); //2
    }
    if (!this.cubeExists(x + 1, y, z) && !this.cubeExists(x, y - 1, z)) {
      this.drawLine(ctx, x + 1, y + 0, z + 0, x + 1, y + 0, z + 1); //3
    }
    if (!this.cubeExists(x, y + 1, z)) {
      this.drawLine(ctx, x + 1, y + 1, z + 0, x + 1, y + 1, z + 1); //4
    }
    if (!this.cubeExists(x, y, z + 1) && !this.cubeExists(x, y - 1, z)) {
      this.drawLine(ctx, x + 0, y + 0, z + 1, x + 1, y + 0, z + 1); //5
    }
    if (!this.cubeExists(x, y, z + 1) && !this.cubeExists(x + 1, y, z)) {
      this.drawLine(ctx, x + 1, y + 0, z + 1, x + 1, y + 1, z + 1); //6
    }
    if (!this.cubeExists(x - 1, y, z)) {
      this.drawLine(ctx, x + 0, y + 0, z + 1, x + 0, y + 1, z + 1); //7
    }
    if (!this.cubeExists(x, y + 1, z)) {
      this.drawLine(ctx, x + 0, y + 1, z + 1, x + 1, y + 1, z + 1); //8
    }

    ctx.stroke();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    /*

       |
      z|y/
       |/
       /
       \
       x\
         \


    */

    ctx.fillStyle = 'black';
    for (let x = 0; x < 10; x++) {
      for (let y = 9; y >= 0; y--) {
        for (let z = 0; z < 10; z++) {
          if (this.cubes[`${x},${y},${z}`]) {
            this.drawCube(ctx, x, y, z);
          }
        }
      }
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
