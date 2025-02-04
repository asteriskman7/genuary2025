'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.initTriangles();
  }

  initTriangles() {
    this.triangles = [
      {
        points: [{x: 0, y: 0}, {x: this.canvas.width, y: 0}, {x: 0, y: this.canvas.height}],
        c: 0,
        a: 100,
        dc: 90
      },
      {
        points: [{x: this.canvas.width, y: 0}, {x: this.canvas.width, y: this.canvas.height}, {x: 0, y: this.canvas.height}],
        c: 180,
        a: 100,
        dc: 90
      }
    ];

    this.triangles.forEach( t => {
      t.a = this.getTriangleArea(t);
    });

    this.nextTime = this.t + 1;
  }

  getTriangleArea(t) {
    const x1 = t.points[0].x;
    const y1 = t.points[0].y;
    const x2 = t.points[1].x;
    const y2 = t.points[1].y;
    const x3 = t.points[2].x;
    const y3 = t.points[2].y;
    //https://www.omnicalculator.com/math/area-triangle-coordinates
    return 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  }

  divideTriangle(t) {
    /*
      p1
      +
      |\
    e0| \1e
      |  \
    p0+---+p2
       e2

    */

    const edge = Math.floor(Math.random() * 3);
    //edge n is from point n to point (n + 1) % 3
    //t0 has points pn, avg(pn, p(n+1)%3), p(n+2)%3)
    //t1 has points avg(pn, p(n+1)%3), p(n+1)%3, p(n+2)%3

    const edgep1 = (edge + 1) % 3;
    const edgem1 = (edge + 2) % 3;

    const ax = (t.points[edge].x + t.points[edgep1].x) * 0.5;
    const ay = (t.points[edge].y + t.points[edgep1].y) * 0.5

    const t0 = {
      points: [{...t.points[edge]}, {x: ax, y: ay}, {...t.points[edgem1]}],
      c: t.c - t.dc,
      a: 0,
      dc: t.dc / 2
    };

    const t1 = {
      points: [{x: ax, y: ay}, {...t.points[edgep1]}, {...t.points[edgem1]}],
      c: t.c + t.dc,
      a: 0,
      dc: t.dc / 2
    };

    t0.a = this.getTriangleArea(t0);
    t1.a = this.getTriangleArea(t1);

    return [t0, t1];
  }

  //runs once per frame. Time is this.t
  update() {
    if (this.t > this.nextTime || true) {

      let triIndex = Math.floor(Math.abs(this.gaussianRandom(0, this.triangles.length / 4)));
      if (triIndex > this.triangles.length - 1) {
        triIndex = Math.floor(Math.random() * this.triangles.length);
      }


      const newTriangles = this.divideTriangle(this.triangles[triIndex]);
      this.triangles[triIndex] = newTriangles[0];
      this.triangles.push(newTriangles[1]);

      this.nextTime = this.t + 1;
    }

    this.triangles.sort( (a, b) => b.a - a.a );

    if (this.triangles.length >= 300) {
      this.initTriangles();
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'black';
    this.triangles.forEach( t => {
      ctx.fillStyle = `hsl(${t.c}, 50%, 50%)`;
      ctx.strokeStyle = `hsl(${t.c}, 50%, 50%)`;
      ctx.beginPath();
      ctx.moveTo(t.points[0].x, t.points[0].y);
      ctx.lineTo(t.points[1].x, t.points[1].y);
      ctx.lineTo(t.points[2].x, t.points[2].y);
      ctx.lineTo(t.points[0].x, t.points[0].y);
      ctx.fill();
      ctx.stroke();
    });

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
