'use strict';

window.sketchClass = class extends Sketch {
  desc = "Evolve triangles into an emoji. Press 'a' to see the target"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    const ctx = this.ctx;

    this.emoji = String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 80)); 

    this.drawTargetImage(ctx);

    this.pixelData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    this.initPopulation();
  }

  drawTargetImage(ctx) {
    ctx.fillStyle = 'white';;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = '500px Arial';
    ctx.fillText(this.emoji, -90 , 430);
    
  }

  getImageError(ctx, stepSize) {
    let error = 0;
    const currentData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    for (let x = 0; x < this.canvas.width; x += stepSize) {
      for (let y = 0; y < this.canvas.height; y += stepSize) {
        const pixelIndex = (x + y * this.canvas.width) * 4;
        const gr = this.pixelData[pixelIndex + 0];
        const gg = this.pixelData[pixelIndex + 1];
        const gb = this.pixelData[pixelIndex + 2];
        const cr = currentData[pixelIndex + 0];
        const cg = currentData[pixelIndex + 1];
        const cb = currentData[pixelIndex + 2];
        error += Math.abs(gr - cr);
        error += Math.abs(gg - cg);
        error += Math.abs(gb - cb);
        //error += Math.pow(Math.abs(gr - cr), 2);
        //error += Math.pow(Math.abs(gg - cg), 2);
        //error += Math.pow(Math.abs(gb - cb), 2);
      }
    }

    return error;
  }

  getRandomTri() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    return [
      [Math.random() * w, Math.random() * h],
      [Math.random() * w, Math.random() * h],
      [Math.random() * w, Math.random() * h],
      [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
    ];
  }

  initPopulation() {
    this.population = [];
    this.generations = 0;
    const initialTris = 200;

    for (let i = 0; i < initialTris; i++) {
      const org = {error: Infinity, tris: []};
      for (let j = 0; j < 10; j++) {
        org.tris.push(this.getRandomTri());
      }

      this.drawOrg(this.ctx, org, true);
      org.error = this.getImageError(this.ctx, 10) + org.tris.length;
      this.population.push(org);
    }
  }

  drawOrg(ctx, org, bg) {
    if (bg) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    org.tris.forEach( t => {
      ctx.fillStyle = `rgb(${t[3][0]}, ${t[3][1]}, ${t[3][2]}`;
      ctx.beginPath();
      ctx.moveTo(t[0][0], t[0][1]);
      ctx.lineTo(t[1][0], t[1][1]);
      ctx.lineTo(t[2][0], t[2][1]);
      ctx.lineTo(t[0][0], t[0][1]);
      ctx.fill();
    });
  }

  mutateOrg(org) {
    const pTriAdd = 0.1;
    const pTriDel = 0.01;
    /*
    const pCoordMove = 0.1;
    const pColorMove = 0.1;
    const colorMoveDist = 50;
    const coordMoveDist = 50;
    */
    const pCoordMove = 0.9;
    const pColorMove = 0.9;
    const colorMoveDist = 1;
    const coordMoveDist = 1;

    org.tris.forEach( tri => {
      if (Math.random() < pTriDel) {
        tri[4] = true;
      } else {
        if (Math.random() < pColorMove) { tri[3][0] = Math.min(255, Math.max(0, tri[3][0] + 2 * colorMoveDist * Math.random() - colorMoveDist)); }
        if (Math.random() < pColorMove) { tri[3][1] = Math.min(255, Math.max(0, tri[3][1] + 2 * colorMoveDist * Math.random() - colorMoveDist)); }
        if (Math.random() < pColorMove) { tri[3][2] = Math.min(255, Math.max(0, tri[3][2] + 2 * colorMoveDist * Math.random() - colorMoveDist)); }
        if (Math.random() < pCoordMove) { tri[0][0] = tri[0][0] + 2 * coordMoveDist * Math.random() - coordMoveDist; }
        if (Math.random() < pCoordMove) { tri[0][1] = tri[0][1] + 2 * coordMoveDist * Math.random() - coordMoveDist; }
        if (Math.random() < pCoordMove) { tri[1][0] = tri[1][0] + 2 * coordMoveDist * Math.random() - coordMoveDist; }
        if (Math.random() < pCoordMove) { tri[1][1] = tri[1][1] + 2 * coordMoveDist * Math.random() - coordMoveDist; }
        if (Math.random() < pCoordMove) { tri[2][0] = tri[2][0] + 2 * coordMoveDist * Math.random() - coordMoveDist; }
        if (Math.random() < pCoordMove) { tri[2][1] = tri[2][1] + 2 * coordMoveDist * Math.random() - coordMoveDist; }
      }
    });

    org.tris = org.tris.filter( tri => tri[4] !== true );

    if (Math.random() < pTriAdd) {
      org.tris.push(this.getRandomTri());
    }
  }

  cloneOrg(org) {
    const clone = {
      error: Infinity,
      tris: new Array(org.tris.length)
    };

    org.tris.forEach( (tri, i) => {
      clone.tris[i] = [
        [tri[0][0], tri[0][1]],
        [tri[1][0], tri[1][1]],
        [tri[2][0], tri[2][1]],
        [tri[3][0], tri[3][1], tri[3][2]]
      ];
    });

    return clone;
  }

  crossOrgs(org0, org1) {
    const triCount0 = org0.tris.length;
    const triCount1 = org1.tris.length;
    const childTriCount = Math.max(triCount0, triCount1);
    const child = {
      error: Infinity,
      tris: new Array(childTriCount)
    };

    for (let i = 0; i < childTriCount; i++) {
      if (triCount0 > i && triCount1 > i) {
        child.tris[i] = Math.random() < 0.5 ? org0.tris[i] : org1.tris[i]
      } else {
        if (triCount0 > i) {
          child.tris[i] = org0.tris[i];
        } else {
          child.tris[i] = org1.tris[i];
        }
      }
    }
    return child;
  }

  evolve() {
    //mutate
    const saveCount = 5;
    const childCount = 5;
    const saveClones = 20;
    const newPop = [];
    let i = 0;
    while (newPop.length < this.population.length) {
      const org = this.population[i];

      //keep the best
      if (i < saveCount) {
        newPop.push(org);

        //cross
        for (let j = 0; j < childCount; j++) {
          const mateIndex = Math.floor(Math.random() * this.population.length);
          if (mateIndex !== i) {
            const child = this.crossOrgs(org, this.population[mateIndex]);
            this.drawOrg(this.ctx, child, true);
            child.error = this.getImageError(this.ctx, 10) + child.tris.length;
          }
        }
      }

      //clone & mutate
      for (let j = 0; j < saveClones; j++) {
        const orgClone = this.cloneOrg(org);
        this.mutateOrg(orgClone);
        //evaluate
        this.drawOrg(this.ctx, orgClone, true);
        orgClone.error = this.getImageError(this.ctx, 10) + orgClone.tris.length;

        newPop.push(orgClone);
      }

      i++;
    }

    this.population = newPop;

    //sort
    this.population.sort( (a, b) => {
      return a.error - b.error;
    });
  }

  //runs once per frame. Time is this.t
  update() {
    this.evolve();
    this.generations++;
  }

  draw(ctx, width, height, t) {
    this.drawTargetImage(ctx);
    if (this.keys.a === true) {
    } else {
      this.drawOrg(ctx, this.population[0], false);
    }

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(this.generations, 10, 20);
    ctx.fillText(this.population[0].error, 10, 40);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
