'use strict';

window.sketchClass = class extends Sketch {
  desc = "if (dot in box) { go boom! }"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.initSim();
  }

  initSim() {
    //create terrain
    this.terrain = [];
    let x = 0;
    const dx = 20;
    while (x <= this.canvas.width + dx) {
      const y = 400 + Math.abs(50 * Math.sin(x / 50));
      this.terrain.push([x, y]);
      x += dx;
    }
    //init tanks
    const tankCount = 4;
    this.tanks = [];
    for (let i = 0; i < tankCount; i++) {
      const f = Math.round(this.terrain.length * (i + 1) / (tankCount + 1));
      const tankX = this.terrain[f][0] + dx / 2;
      const tankY = this.terrain[f][1];
      this.tanks.push({state: 'chooseAngle', targetIndex: -1, x: tankX, y: tankY, a: 3 * Math.PI / 2});
    }
    this.turn = 0;
    this.particles = [];
    this.bullets = [];
  }

  getNextFiringSolution(tSrc, tDst) {
    const dir = Math.sign(tDst.x - tSrc.x)
    if (tSrc.impactX === undefined) {
      return {a: 3 * Math.PI / 2 + dir * Math.PI / 8, v: 10};
    } else {
      if (tSrc.impactX > tDst.x) {
        return {a: tSrc.aTarget , v: tSrc.v - 2 * dir * Math.random()};
      } else {
        return {a: tSrc.aTarget, v: tSrc.v + 2 * dir * Math.random()};
      }
    }
  }

  pointInTank(x, y, tank) {
    //ctx.fillRect(tank.x - tankSize / 2, tank.y - tankSize, tankSize, tankSize);
    const tankSize = 10;
    return x >= tank.x - tankSize / 2 &&
           x <= tank.x + tankSize / 2 &&
           y >= tank.y - tankSize &&
           y <= tank.y;
  }

  //runs once per frame. Time is this.t
  update() {
    this.tanks.forEach( (tank, i) => {
      if (i !== this.turn) {return;}

      switch (tank.state) {
        case 'chooseAngle': {
          //pick a target
          let targetIndex;
          if (tank.targetIndex === -1) {
            do {
              targetIndex = Math.floor(Math.random() * this.tanks.length);
            } while (targetIndex === i)
          } else {
            targetIndex = tank.targetIndex;
          }
          const target = this.tanks[targetIndex]

          //getFiringSolution
          const firingSolution = this.getNextFiringSolution(tank, target);
          tank.impactX = undefined;
          tank.aTarget = firingSolution.a;
          tank.v = firingSolution.v;
          tank.targetIndex = targetIndex;

          //change state
          tank.state = 'changeAngle';
          break;
        }
        case 'changeAngle': {
          //const da = 0.005;
          const da = 0.1;
          const deltaA = tank.a - tank.aTarget;
          if (Math.abs(deltaA) < da) {
            tank.a = tank.aTarget;
            tank.state = 'fire';
          } else {
            tank.a = tank.a - da * Math.sign(deltaA);
          }
          break;
        }
        case 'fire': {
          const bullet = {
            x: tank.x,
            y: tank.y,
            lastX: tank.x,
            lastY: tank.y,
            srcI: i,
            dstX: this.tanks[tank.targetIndex].x,
            dstY: this.tanks[tank.targetIndex].y,
            vx: tank.v * Math.cos(tank.a),
            vy: tank.v * Math.sin(tank.a),
            hit: 0 
          };
          this.bullets.push(bullet);
          tank.state = 'waitBullet';
          break;
        }
        case 'waitBullet': {
          if (this.bullets.length === 0) {
            if (tank.impactX !== undefined) {
              //hit ground

            } else {
              //pick a new target
              tank.targetIndex = -1;
              tank.impactX = undefined;
            }

            tank.state = 'chooseAngle';
            this.turn = (this.turn + 1) % this.tanks.length;
          }
          break;
        }
      }
    });

    const gravity = 1;
    this.bullets.forEach( b => {
      b.vy += gravity;
      b.lastX = b.x;
      b.lastY = b.y;
      b.x += b.vx;
      b.y += b.vy;

      //check for collision with other tank
      this.tanks.some( (tank, i) => {
        if (i === b.srcI) {return;}

        const dx = b.x - b.lastX;
        const dy = b.y - b.lastY;
        for (let j = 0; j <= 10; j++) {
          
          if (this.pointInTank(b.lastX + dx * j / 10, b.lastY + dy * j / 10, tank)) {
            b.dstX = tank.x;
            b.dstY = tank.y;
            b.hit = 1;
            return true;
          }
        }

        return false;
      });

      if (b.hit === 0) {
        //check for collision with ground or OOB
        if (b.x < 0 || b.x > this.canvas.width) {
          b.hit = 2;
          this.tanks[this.turn].impactX = b.x;
        } else {
          for (let j = 0; j < this.terrain.length; j++) {
            const terrain = this.terrain[j];
            if (terrain[0] > b.x) {
              const lastTerrain = this.terrain[j - 1];
              if (b.y >= lastTerrain[1]) {
                b.hit = 2;
                b.y = lastTerrain[1];
                this.tanks[this.turn].impactX = b.x;
              }
              break;
            }
          }
        }
      }
    });

    if (this.bullets.length > 0 && this.bullets[0].hit !== 0) {
      if (this.bullets[0].hit === 1) {
        this.generateExplosion(this.bullets[0].dstX, this.bullets[0].dstY, 100, 1);
      } else {
        this.generateExplosion(this.bullets[0].x, this.bullets[0].y, 10, 0.1);
      }
      this.bullets = [];
    }

    this.particles = this.particles.filter( p => (p.t0 + p.life) > this.t );

  }

  generateExplosion(x, y, count, duration) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * 2 * Math.PI;
      const v = 50 + 50 * Math.random();
      const p = {
        x0: x,
        y0: y,
        t0: this.t,
        life: duration,
        dx: v * Math.cos(a),
        dy: v * Math.sin(a)
      };

      this.particles.push(p);
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    //draw terrain
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    this.terrain.forEach( (l, i) => {
      if (i === 0) {
        ctx.moveTo(l[0], l[1]);
      } else { 
        ctx.lineTo(l[0], this.terrain[i - 1][1]);
        ctx.lineTo(l[0], l[1]);
      } 
    });
    ctx.stroke();

    //draw tanks
    ctx.fillStyle = 'white';
    const tankSize = 10;
    const gunL = 20;
    this.tanks.forEach( tank => {
      ctx.fillRect(tank.x - tankSize / 2, tank.y - tankSize, tankSize, tankSize);
      ctx.beginPath();
      ctx.moveTo(tank.x, tank.y - tankSize / 2);
      ctx.lineTo(tank.x + gunL * Math.cos(tank.a), tank.y + gunL * Math.sin(tank.a));
      ctx.stroke();
    });

    //draw bullets
    this.bullets.forEach( b => {
      ctx.fillRect(b.x, b.y, 2, 2);
    });

    //drawParticles
    this.particles.forEach( p => {
      const dt = t - p.t0;
      ctx.fillRect(p.x0 + dt * p.dx, p.y0 + dt * p.dy, 1, 1);
      //ctx.fillRect(p.x0 , p.y0, 1, 1);
    });
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
