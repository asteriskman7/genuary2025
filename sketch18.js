'use strict';

window.sketchClass = class extends Sketch {
  desc = "That really blows"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.particles = [];
    this.cyclones = [
      {
        cx: this.canvas.width * 0.25,
        cy: this.canvas.height * 0.25,
        a: 20
      },
      {
        cx: this.canvas.width * 0.75,
        cy: this.canvas.height * 0.75,
        a: 20
      },
      {
        cx: this.canvas.width * 0.25,
        cy: this.canvas.height * 0.75,
        a: -20
      },
      {
        cx: this.canvas.width * 0.75,
        cy: this.canvas.height * 0.25,
        a: -20
      }
    ];
  }

  //runs once per frame. Time is this.t
  update() {

    //move cyclones
    const r = this.canvas.width / 8;
    this.cyclones.forEach( (c, i) => {
      c.x = c.cx + r * Math.cos((i + 1) * this.t / 2);
      c.y = c.cy + r * Math.sin((i + 3) * this.t / 2);
    });

    //generate particles
    for (let i = 0; i < 50; i++) {
      this.particles.push(
        {
          x: Math.random() * this.canvas.width, 
          y: Math.random() * this.canvas.height, 
          dx: 0, 
          dy: 0, 
          t0: this.t
        }
      );
    }

    //update particles
    this.particles.forEach( p => {

      let fx = 0;
      let fy = 0;
      this.cyclones.forEach( c => {
        const dx = c.x - p.x;
        const dy = c.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = 10 * c.a / (d );
        const a = Math.atan2(dy, dx) + Math.PI / 2;

        fx += f * Math.cos(a);
        fy += f * Math.sin(a);
      });
      const friction = 0.2;
      p.dx += fx - friction * p.dx;
      p.dy += fy - friction * p.dy;

      p.x += p.dx;
      p.y += p.dy;
    });

    //remove particles
    const boundarySize = 40;
    this.particles = this.particles.filter( p =>  p.x > -boundarySize && p.x < (this.canvas.width + boundarySize) &&
      p.y > -boundarySize && p.y < (this.canvas.height + boundarySize) && (p.t0 + 10) > this.t
    );

  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    const finR = 80;
    const finCount = 5;
    const finRate = 1/2;
    this.cyclones.forEach( c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      for (let i = 0; i < finCount; i++) {
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + finR * Math.cos(-c.a * finRate * t + Math.PI * i * 2/ finCount), 
                   c.y + finR * Math.sin(-c.a * finRate * t + Math.PI * i * 2 / finCount));
      }
      ctx.stroke();
    });

    ctx.fillStyle = 'white';
    this.particles.forEach( p => {
      const vt = Math.abs(p.dx) + Math.abs(p.dy);
      ctx.fillStyle = `hsl(${vt * 300 / 30}, 100%, 50%)`;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
