class Bot {

  constructor(world, birb, cols){
    this.birb = birb;
    this.birb.setWallCollisionHandler(this.newEpoch.bind(this));
    //this.birb.setColumnLastCollisionHandler(this.newEpoch.bind(this));
    this.cols = cols;
    this.world = world;
    this.epoch = 0;
    this.temperature = 100;
    this.nn = new NeuralNetwork(5, 4, 1);
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
    let updateWeights = 0.1; // amount of updates weights in percentage
    for (let i = 0; i < this.data.length; i++){
      if (Math.random() < updateWeights)
        this.data[i] = this.temperature * (Math.random() * 2 - 1) / 20;
      else
        this.data[i] = this.bestData[i];
    }
    this.nn.setWeights(this.data);
    //this.nn.showWeights();
    this.temperature *= 0.999;
    this.prevScore = distance;
  }
}
