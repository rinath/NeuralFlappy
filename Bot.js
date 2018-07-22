function Bot(birb, cols){
  this.birb = birb;
  this.cols = cols;
  this.nn = new NeuralNetwork(5, 3, 2);

  var frame = 0;
  this.update = function(gameSpeed){
    /*frame++;
    //if (frame % 39 == 0){
      frame = 0;
      this.birb.jump();
    }
    */
    var nearestColumn = this.cols.nearestColumn(this.birb);
    var data = nearestColumn.concat([this.birb.vel, gameSpeed]);
    //console.log(data);
    let output = this.nn.forwardPropagation(data);
    //console.log('forwardProp:' + output);
    if (output[0] > 0)
      this.birb.jump();
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
  let count = 0;
  for (let i = 1; i < arguments.length; i++){
    let tmp = [];
    for (let j = 0; j < arguments[i] - 1; j++){
      tmp.push([]);
      for (let k = 0; k < arguments[i - 1]; k++){
        //tmp[j].push(count);
        tmp[j].push(Math.random() * 2 - 1);
        count++;
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
  console.log('count:' + count);

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
