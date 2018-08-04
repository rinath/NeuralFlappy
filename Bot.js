class BasicBot {
  constructor(world, cols){
    this.cols = cols;
    this.birb = new Birb(world.getHeight(), cols);
    this.birb.setWallCollisionHandler(this.onCollision.bind(this));
    this.birb.setColumnCollisionHandler(this.onCollision.bind(this));
    this.mIsAlive = true;
    this.neuralNet = new NeuralNetwork(5, 6, 1);
    this.fitness = 0;
    this.frame = 0;
    this.nearestHoleY = 0;
  }
  onCollision(){
    this.mIsAlive = false;
    this.fitness = this.birb.getDistance() - this.nearestHoleY / 2;
    console.log('BasicBot.onCollision, fitness:' + tostr(this.fitness) + ', distance:'
      + tostr(this.birb.getDistance()) + ', nearestHoleY:' + tostr(this.nearestHoleY));
    this.birb.resetDistance();
  }
  isAlive(){
    return this.mIsAlive;
  }
  setWeights(data){
    this.neuralNet.setWeights(data);
  }
  getFitness(){
    return this.fitness;
  }
  getNeuralNet(){
    return this.neuralNet;
  }
  reset(){
    this.mIsAlive = true;
  }
  update(gameSpeed){
    if (this.mIsAlive){
      this.frame++;
      this.birb.update(gameSpeed);
      let nearestColumn = this.birb.getNearestColumn();
      this.nearestHoleY = Math.abs(nearestColumn[1]);
      nearestColumn = [nearestColumn[0] / 300, nearestColumn[1] / 50];
      let data = nearestColumn.concat([this.birb.getY() / 300, this.birb.vel / 10, gameSpeed / 10]);
      let output = this.neuralNet.forwardPropagation(data);
      if (output[0] > 0.5)
        this.birb.jump();
      if (output[0] > 2)
        console.log('SOMETHING WEIRD, OUTPUT[0]:' + output[0]);
      return output[0] > 0.5;
    }
  }
  draw(g, color){
    if (this.mIsAlive){
      this.birb.draw(g, color);
    }
  }
}

class BotSA extends BasicBot {
  constructor(world, cols){
    super(world, cols);
    this.annealing = new SimulatedAnnealing(this.getNeuralNet().getAmountOfWeights(), 5, 0.998, true);
  }
  onCollision(){
    super.onCollision();
    this.annealing.updateState(this.getFitness() / 100);
    this.setWeights(this.annealing.generateState());
  }
  draw(g){
    super.draw(g, 'red');
  }
}

class BotGA {
  constructor(world, cols){
    this.cols = cols;
    this.world = world;
    this.epoch = 0;
    this.bots = [];
    let population = 20;
    for (let i = 0; i < population; i++){
      this.bots.push(new BasicBot(world, cols));
    }
    this.ga = new RCGA(population, 0.3);
    this.ga.addFeature(-100, 100, this.bots[0].getNeuralNet().getAmountOfWeights())
  }
  isAlive(){
    for (let bot of this.bots)
      if (bot.isAlive())
        return true;
    return false;
  }
  update(gameSpeed){
    for (let bot of this.bots)
      bot.update(gameSpeed);
  }
  reset(){
    for (let i = 0; i < this.bots.length; i++){
      this.bots[i].reset();
      this.ga.setFitness(i, this.bots[i].getFitness());
      this.bots[i].setWeights(this.ga.getCreature(i));
    }
    this.ga.newEpoch();
    //this.ga.showData();
  }
  getNeuralNet(){
    for (let bot of this.bots)
      if (bot.isAlive())
        return bot.getNeuralNet();
    return this.bots[0].getNeuralNet();
  }
  draw(g){
    for (let bot of this.bots)
      bot.draw(g, 'green');
  }
}
