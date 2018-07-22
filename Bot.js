function Bot(birb, cols){
  this.birb = birb;
  this.cols = cols;
  this.nn = new NeuralNetwork(5, 3, 2);
  this.data = new Array(this.nn.getAmountOfWeights());
  this.bestData = new Array(this.nn.getAmountOfWeights());
  for (let i = 0; i < this.data.length; i++){
    this.data[i] = Math.random() * 20 - 10;
    this.bestData[i] = this.data[i];
  }
  this.nn.setWeights(this.data);
  this.collisionFrame = -1;

  this.update = function(gameSpeed, score){
    let nearestColumn = this.cols.nearestColumn(this.birb);
    let data = nearestColumn.concat([this.birb.vel, gameSpeed]);
    let output = this.nn.forwardPropagation(data);
    if (output[0] > 0)
      this.birb.jump();
    if (this.collisionFrame >= 0)
      this.collisionFrame--;
    if (this.collisionFrame == 0){
      this.newEpoch(score);
    }
  }

  this.onCollision = function(){
    this.collisionFrame = 2;
    console.log('Bot.onCollision');
  }

  let prevScore = 0;
  this.newEpoch = function(score){
    // TODO: todododototdoooo
    if (prevScore);
    for (let i = 0; i < this.data.length; i++){
      this.data[i] += Math.random() * 2 - 1;
    }
    this.nn.setWeights(this.data);
    this.nn.showWeights();
    prevScore = score;
  }
}

function NeuralNetwork(){
  this.weights = [];
  this.outputs = [];
  let str = '';
  for (let i = 0; i < arguments.length; i++)
    str += arguments[i] + ', ';
  console.log('arguments: ' + str);
  for (let i = 0; i < arguments.length; i++){
    this.outputs.push([]);
    for (let j = 0; j < arguments[i]; j++)
      this.outputs[i].push(1);
  }
  this.countWeights = 0;
  for (let i = 1; i < arguments.length; i++){
    let tmp = [];
    for (let j = 0; j < arguments[i] - 1; j++){
      tmp.push([]);
      for (let k = 0; k < arguments[i - 1]; k++){
        tmp[j].push(this.countWeights);
        //tmp[j].push(Math.random() * 2 - 1);
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
  console.log('count:' + this.countWeights);

  this.setWeights = function(weights){
    if (weights.length != this.countWeights)
      console.log('ERROR ### Bot.setWeights, incorrect amount of weights');
    console.log('NN.setWeights:');
    let ind = 0;
    for (let i = 0; i < this.weights.length; i++)
      for (let j = 0; j < this.weights[i].length; j++)
        for (let k = 0; k < this.weights[i][j].length; k++)
          this.weights[i][j][k] = weights[ind++];
  }

  this.showWeights = function(){
    let str = '';
    for (let i = 0; i < this.weights.length; i++){
      str += '{';
      for (let j = 0; j < this.weights[i].length; j++){
        str += '[';
        for (let k = 0; k < this.weights[i][j].length; k++){
          str += Number(this.weights[i][j][k]).toFixed(3) + ',';
        }
        str += '],';
      }
      str += '}';
    }
    console.log('weights:' + str);
  }

  this.getAmountOfWeights = function(){
    return this.countWeights;
  }

  this.forwardPropagation = function(inputs){
    for (let i = 0; i < inputs.length; i++)
      this.outputs[0][i] = inputs[i];
    if (inputs.length != this.weights[0][0].length - 1)
      console.log('ERROR ### forwardProp, incorrect number of arguments');
    for (let i = 0; i < this.weights.length; i++){
      for (let j = 0; j < this.weights[i].length; j++){
        this.outputs[i + 1][j] = 0;
        for (let k = 0; k < this.weights[i][j].length; k++){
          this.outputs[i + 1][j] += this.outputs[i][k] * this.weights[i][j][k];
        }
        this.outputs[i + 1][j] = this.hardTanhActivation(this.outputs[i + 1][j]);
      }
    }
    return this.outputs[this.outputs.length - 1];
  }

  this.hardTanhActivation = function(x){
    if (x < -1)
      return -1;
    else if (x > 1)
      return 1;
    return x;
  }

  this.stepActivation = function(x){
    if (x > 0)
      return 1;
    return 0;
  }
}
