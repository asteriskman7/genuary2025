'use strict';

window.sketchClass = class extends Sketch {
  desc = "Did you say something?"; // jshint ignore:line

  load() {
    this.particles = [];
  }

  update() {
    this.particles.push({c: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()+=<>/~?'.split('')[Math.floor(Math.random() * 53)], x0: 180, y0: 360, t0: this.t, a: this.lmap(Math.random(), 0, 1, - Math.PI / 6, Math.PI/6)});

    this.particles.forEach( p => {
      p.age = (this.t - p.t0);
      p.x = p.x0 + 290 * p.age * Math.cos(p.a);
      p.y = p.y0 + 290 * p.age * Math.sin(p.a);
    });

    this.particles = this.particles.filter( p => p.x < 550 && p.y < 550 );
  }

  draw(ctx, width, height, t) {
    ctx.clearRect(0, 0, width, height);

    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 2;
    this.particles.forEach( p => {
      ctx.fillStyle = `hsla(0, 0%, 100%, ${this.lmap(p.age, 0, 1, 1, 0)})`;
      ctx.strokeStyle = `hsla(0, 0%, 0%, ${this.lmap(p.age, 0, 1, 1, 0)})`;
      ctx.fillText(p.c, p.x, p.y);
      ctx.strokeText(p.c, p.x, p.y);
    });

    ctx.fillStyle = 'black';
    ctx.font = '400px Arial';
    ctx.fillText('\ud83d\udde3\ufe0f', -150, 420);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
