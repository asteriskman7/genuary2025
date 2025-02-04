'use strict';

/*
  the network quickly decides that everything is always black...

  used this as a basis to learn some concepts but didn't follow the code
    and didn't read the section on how backpropagation works
    http://neuralnetworksanddeeplearning.com/index.html
*/

class NN {
  constructor(layerCounts) {
    this.layers = new Array(layerCounts.length);
    layerCounts.forEach( (c, i) => {
      //probably don't need the 0th array because the input will come from external array
      this.layers[i] = new Array(c);

      if (i > 0) {
        for (let ni = 0; ni < c; ni++) {
          const b = Math.random() * 2 - 1;
          const w = new Array(this.layers[i - 1].length);
          for (let wi = 0; wi < w.length; wi++) {
            w[wi] = Math.random() * 2 - 1;
          }
          this.layers[i][ni] = {w, b, o: 0, wp: [...w], bp: b};
        }
      }
    });
  }

  sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

  feedForward(inputs) {
    const nodes = this.layers[1];
    nodes.forEach( (node, nodeIndex) => {
      const weightSum = node.w.reduce( (acc, e, i) => {
        return acc + e * inputs[i];
      }, 0);
      node.o = this.sigmoid(weightSum + node.b);
    });
    for (let layerIndex = 2; layerIndex < this.layers.length; layerIndex++) {
      //output is sig(sum(w*x) + b)
      const nodes = this.layers[layerIndex];
      nodes.forEach( (node, nodeIndex) => {
        const weightSum = node.w.reduce( (acc, e, i) => {
          return acc + e * this.layers[layerIndex - 1][i].o;
        }, 0);
        node.o = this.sigmoid(weightSum + node.b);
      });
    }
  }

  calcError(goal) {
    return this.layers[this.layers.length - 1].reduce( (acc, e, i) => {
      return acc + Math.pow(e.o - goal[i], 2);
    }, 0);
  }

  learn(inputs, goal, rate) {
    this.feedForward(inputs);
    const baseError = this.calcError(goal);
    for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
      const nodes = this.layers[layerIndex];
      nodes.forEach( (node, nodeIndex) => {
        node.bp = node.b;
        node.b += rate;
        this.feedForward(inputs);
        const deltaError = this.calcError(goal) - baseError;
        node.bp -= deltaError * rate;
        //node.bp -= Math.sign(deltaError) * rate;
        node.w.forEach( (weight, weightIndex) => {
          node.wp[weightIndex] = weight;
          node.w[weightIndex] += rate;
          this.feedForward(inputs);
          const deltaError = this.calcError(goal) - baseError;
          node.wp[weightIndex] -= deltaError * rate;
          //node.wp[weightIndex] -= Math.sign(deltaError) * rate;
        });
      });
    }
    for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
      const nodes = this.layers[layerIndex];
      nodes.forEach( node => {
        [node.b, node.bp] = [node.bp, node.b];
        [node.w, node.wp] = [node.wp, node.w];
      });
    }
  }

  getOutputs() {
    return this.layers[this.layers.length - 1].map( n => n.o );
  }
}

window.sketchClass = class extends Sketch {
  desc = "The impossible task has been confirmed to be impossible"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    const inputSize = 64;
    this.NN = new NN([inputSize, 10, 2]);

    this.white = (new Array(inputSize)).fill(1);
    this.black = (new Array(inputSize)).fill(0);

    this.trainingCount = 0;
  }

  train(n) {
    const trainingDataList = [
      {inputs: this.white, goal: [0, 1]},
      {inputs: this.black, goal: [1, 0]}
    ];
    for (let i = 0; i < n; i++) {
      const trainingIndex = Math.floor(Math.random() * trainingDataList.length);
      const trainingData = trainingDataList[trainingIndex];
      this.NN.learn(trainingData.inputs, trainingData.goal, 0.01);
    }
    this.trainingCount += n;
    //console.log('training complete');
  }

  test() {
    this.NN.feedForward(this.white);
    const whiteOutput = this.NN.getOutputs();
    this.NN.feedForward(this.black);
    const blackOutput = this.NN.getOutputs();

    return [blackOutput, whiteOutput];
    
  }

  //runs once per frame. Time is this.t
  update() {
    
    const startTime = (new Date()).getTime();

    while (true) {
      this.train(100);
      const curTime = (new Date()).getTime();

      if (curTime - startTime > 20) {break;}
    }
    
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '15px Monospace';
    ctx.fillStyle = 'white';
    ctx.fillText(`Training count: ${this.trainingCount}`, 10, 50);
    const results = this.test();
    ctx.fillText(`input  p(black)  p(white)`, 10, 75);
    ctx.fillText(`black  ${results[0][0].toFixed(5)}   ${results[0][1].toFixed(5)}`, 10, 100);
    ctx.fillText(`white  ${results[1][0].toFixed(5)}   ${results[1][1].toFixed(5)}`, 10, 130);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
