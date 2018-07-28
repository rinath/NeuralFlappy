class Bot {

  constructor(world, birb, cols){
    this.birb = birb;
    this.birb.setWallCollisionHandler(this.newEpoch.bind(this));
    this.birb.setColumnLastCollisionHandler(this.newEpoch.bind(this));
    this.cols = cols;
    this.world = world;
    this.epoch = 0;
    this.temperature = 100;
    this.nn = new NeuralNetwork(6, 4, 2);
    this.data = new Array(this.nn.getAmountOfWeights());
    this.bestData = new Array(this.nn.getAmountOfWeights());
    for (let i = 0; i < this.data.length; i++){
      this.data[i] = Math.random() * 2 - 1;
      this.bestData[i] = this.data[i];
    }
    this.nn.setWeights(this.data);
    this.prevScore = 0;
  }

  getEpoch(){
    return this.epoch;
  }

  getTemperature(){
    return this.temperature;
  }

  update(gameSpeed){
    let nearestColumn = this.birb.getNearestColumn();
    let data = nearestColumn.concat([this.birb.getY(), this.birb.vel, gameSpeed]);
    let output = this.nn.forwardPropagation(data);
    //let output = this.nn.forwardPropagation([this.birb.getY() / 100]);
    if (output[0] > 0.5)
      this.birb.jump();
    return output[0] > 0.5;
  }

  newEpoch(){
    this.world.resetGameSpeed();
    this.world.resetScore();
    this.epoch++;
    let distance = this.birb.getDistance();
    console.log('newEpoch.distance:' + distance);
    this.birb.resetDistance();
    if (this.prevScore < distance || Math.exp((distance - this.prevScore) / this.temperature) > Math.random() ){
      if (this.prevScore > distance)
        console.log('prevscore:' + this.prevScore + ' > score:' + distance + ' temp:' + this.temperature +
          ' probability:' + Math.exp((distance - this.prevScore) / this.temperature));
      for (let i = 0; i < this.data.length; i++)
        this.bestData[i] = this.data[i];
    }
    let updateWeights = 0.4; // amount of updates weights in percentage
    for (let i = 0; i < this.data.length; i++){
      if (Math.random() < updateWeights)
        this.data[i] = this.bestData[i] + this.temperature * (Math.random() * 2 - 1) / 20;
      else
        this.data[i] = this.bestData[i];
    }
    this.nn.setWeights(this.data);
    //this.nn.showWeights();
    this.temperature *= 0.999;
    this.prevScore = distance;
  }
}

class NeuralNetwork{

  constructor(){
    this.weights = [];
    this.outputs = [];
    this.inputs = [];
    let str = '';
    for (let i = 0; i < arguments.length; i++)
      str += arguments[i] + ', ';
    console.log('arguments: ' + str);
    for (let i = 0; i < arguments.length; i++){
      this.outputs.push([]);
      this.inputs.push([]);
      for (let j = 0; j < arguments[i]; j++){
        this.outputs[i].push(1);
        this.inputs[i].push(1);
      }
    }
    this.countWeights = 0;
    for (let i = 1; i < arguments.length; i++){
      let tmp = [];
      for (let j = 0; j < arguments[i] - 1; j++){
        tmp.push([]);
        for (let k = 0; k < arguments[i - 1]; k++){
          //tmp[j].push(this.countWeights);
          tmp[j].push(Math.random() * 2 - 1);
          this.countWeights++;
        }
      }
      let str = '';
      for (let i = 0; i < tmp.length; i++)
        str += '[' + tmp[i] + '], ';
      console.log('tmp: ' + str);
      this.weights.push(tmp);
    }
    console.log('weights:');
    console.log(this.weights);
    console.log('outputs:');
    console.log(this.outputs);
    console.log('inputs:');
    console.log(this.inputs);
    console.log('count:' + this.countWeights);
  }

  setWeights(weights){
    if (weights.length != this.countWeights)
      console.log('ERROR ### Bot.setWeights, incorrect amount of weights');
    //console.log('NN.setWeights:');
    let ind = 0;
    for (let i = 0; i < this.weights.length; i++)
      for (let j = 0; j < this.weights[i].length; j++)
        for (let k = 0; k < this.weights[i][j].length; k++)
          this.weights[i][j][k] = weights[ind++];
    this.showWeights();
  }

  showWeights(){
    let str = '';
    for (let i = 0; i < this.weights.length; i++){
      str += '{';
      for (let j = 0; j < this.weights[i].length; j++){
        str += '[';
        for (let k = 0; k < this.weights[i][j].length; k++){
          str += Number(this.weights[i][j][k]).toFixed(3) + ', ';
        }
        str += '], ';
      }
      str += '}';
    }
    console.log('weights:' + str);
  }

  getAmountOfWeights(){
    return this.countWeights;
  }

  forwardPropagation(inputs){
    for (let i = 0; i < inputs.length; i++){
      this.outputs[0][i] = inputs[i];
      this.inputs[0][i] = inputs[i];
    }
    if (inputs.length != this.weights[0][0].length - 1)
      console.log('ERROR ### forwardProp, incorrect number of arguments');
    for (let i = 0; i < this.weights.length; i++){
      for (let j = 0; j < this.weights[i].length; j++){
        this.outputs[i + 1][j] = 0;
        this.inputs[i + 1][j] = 0;
        for (let k = 0; k < this.weights[i][j].length; k++){
          this.outputs[i + 1][j] += this.outputs[i][k] * this.weights[i][j][k];
          this.inputs[i + 1][j] += this.inputs[i][k] * this.weights[i][j][k];
        }
        this.outputs[i + 1][j] = this.sigmoidActivation(this.outputs[i + 1][j]);
      }
    }
    return this.outputs[this.outputs.length - 1];
  }

  hardTanhActivation(x){
    if (x < -1)
      return -1;
    else if (x > 1)
      return 1;
    return x;
  }

  stepActivation(x){
    if (x > 0)
      return 1;
    return 0;
  }

  sigmoidActivation(x){
    return 1 / (1 + Math.exp(-x));
  }

  draw(g, x, y, w, h){
    g.clearRect(x, y, w, h);
    g.beginPath();
    g.rect(x, y, w, h);
    g.stroke();
    let fontsize = 10;
    g.font = fontsize + 'px Arial';
    let r = 10;
    let xstart = x + 4 * r, ystart = y + 2 * r;
    let xdistance = (w - 8 * r) / this.weights.length;
    for (let i = 0; i < this.weights.length; i++){
      let rightydistance = (h - 4 * r - fontsize) / (this.weights[i].length);
      for (let j = 0; j < this.weights[i].length; j++){
        let average = 0;
        for (let k = 0; k < this.weights[i][j].length; k++){
          average += Math.abs(this.weights[i][j][k] * this.outputs[i][k]);
        }
        average /= this.weights[i][j].length;
        let leftydistance = (h - 4 * r - fontsize) / (this.weights[i][j].length - 1);
        for (let k = 0; k < this.weights[i][j].length; k++){
          g.beginPath();
          let activated = this.hardTanhActivation(this.weights[i][j][k] * this.outputs[i][k] / average / 2);
          g.strokeStyle = 'rgb(' + (127 + 126 * activated) + ',0,' + (127 - 126 * activated) + ')';
          g.lineWidth = Math.abs(activated * 4);
          g.moveTo(xstart + xdistance * i, ystart + leftydistance * k);
          g.lineTo(xstart + xdistance * (i + 1), ystart + rightydistance * j);
          g.stroke();
          g.fillText(tostr(this.weights[i][j][k]),
            xstart + xdistance * (2 * i + 1) / 2,
            ystart + (leftydistance * k + rightydistance * j) / 2);
        }
      }
    }
    g.strokeStyle = 'black';
    g.lineWidth = 1;
    for (let i = 0; i < this.outputs.length; i++){
      let ydistance = (h - 4 * r - fontsize) / (this.outputs[i].length - 1);
      for (let j = 0; j < this.outputs[i].length; j++){
        if (i == this.outputs.length - 1 && j == this.outputs[i].length - 1)
          continue;
        g.beginPath();
        g.arc(xstart + xdistance * i, ystart + ydistance * j, r, 0, 7);
        g.stroke();
        let str = '';
        if (i == 0)
          str = tostr(this.inputs[i][j]);
        else
          str = tostr(this.inputs[i][j]) + ' > ' + tostr(this.outputs[i][j]);
        g.fillText(str, xstart + xdistance * i - g.measureText(str).width / 2, ystart + ydistance * j + r + fontsize + 3);
      }
    }
  }
}
