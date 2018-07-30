class Bot {

  constructor(world, birb, cols){
    this.birb = birb;
    this.birb.setWallCollisionHandler(this.newEpoch.bind(this));
    this.birb.setColumnLastCollisionHandler(this.newEpoch.bind(this));
    this.cols = cols;
    this.world = world;
    this.epoch = 0;
    this.nn = new NeuralNetwork(5, 4, 1);
    this.annealing = new SimulatedAnnealing(this.nn.getAmountOfWeights(), 5, 0.998, true);
    this.nn.setWeights(this.annealing.generateState());
    this.prevScore = 0;
  }

  getEpoch(){
    return this.epoch;
  }

  getTemperature(){
    return this.annealing.getTemperature();
  }

  update(gameSpeed){
    let nearestColumn = this.birb.getNearestColumn();
    nearestColumn = [nearestColumn[0] / 300, nearestColumn[1] / 50];
    let data = nearestColumn.concat([this.birb.getY() / 300, this.birb.vel / 10, gameSpeed / 10]);
    let output = this.nn.forwardPropagation(data);
    if (output[0] > 0.5)
      this.birb.jump();
    return output[0] > 0.5;
  }

  newEpoch(){
    this.world.resetGameSpeed();
    this.world.resetScore();
    this.epoch++;
    let distance = this.birb.getDistance();
    this.annealing.updateState(distance);
    console.log('newEpoch.distance:' + distance);
    this.birb.resetDistance();
    this.nn.setWeights(this.annealing.generateState());
  }
}
