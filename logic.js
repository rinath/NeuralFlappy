function tostr(number){
  return Number(number).toFixed(2);
}

class World {
  constructor(){
    let canvas = document.getElementById('mycanvas');
    this.width = 1300;
    this.height = 400;
    canvas.width = this.width;
    canvas.height = this.height;
    this.g = canvas.getContext('2d');
    this.UPDATES_PER_FRAME_NORMAL = 4;
    this.UPDATES_PER_FRAME_REWIND = 1000;
    this.updatesPerFrame = this.UPDATES_PER_FRAME_NORMAL;
    this.highScore = 0;
    this.score = 0;
    this.rewind = false;
    this.measuredUpdateTime = 0;
    this.measuredDrawTime = 0;
    this.jumped = false;
    this.initializeGame();
  }
  initializeGame(){
    this.epoch = 0;
    this.cols = new Columns(this.width, this.height);
    this.cols.setOnColumnPassedHandler(this.onColumnPassed.bind(this));
    this.bots = [new BotGA(this, this.cols), new BotSA(this, this.cols), new BotRANDOM(this, this.cols)];
    this.botsName = ['Genetic algorithm', 'Simulated annealing', 'Random weights'];
    this.botsColor = ['red', 'blue', 'green'];
    this.fitnessProgress = new FitnessProgress(this.botsName, this.botsColor);
    this.resetGame();
    this.debug = false;
  }
  getHeight(){
    return this.height;
  }
  isDebugging(){
    return this.debug;
  }
  update(){
    for (let i = 0; i < this.updatesPerFrame; i++){
      let alive = 0;
      for (let bot of this.bots)
        if (bot.isAlive())
          alive++;
      if (alive == 0){
        this.resetGame();
        for (let j = 0; j < this.bots.length; j++){
          this.fitnessProgress.addFitness(j, this.bots[j].getFitness());
          this.bots[j].reset();
        }
        this.epoch++;
      }
      for (let bot of this.bots){
        bot.update(this.gameSpeed);
      }
      this.cols.update(this.gameSpeed);
      this.gameSpeed += 0.0001;
    }
  }
  draw(){
    this.g.strokeStyle = 'black';
    this.g.fillStyle = 'black';
    this.g.lineWidth = 1;
    this.g.clearRect(0, 0, this.width, this.height);
    this.cols.draw(this.g);
    let once = true;
    for (let i = 0; i < this.bots.length; i++){
      this.bots[i].draw(this.g, this.botsColor[i]);
      //this.bots[i].drawFitness(this.g, 700, 0, 300, 400);
      if (this.bots[i].isAlive() && once){
        this.bots[i].getNeuralNet().draw(this.g, 1000, 0, 300, 400);
        once = false;
      }
    }
    this.fitnessProgress.draw(this.g, 700, 0, 300, 400);
    //this.bots[1].drawFitness(this.g, this.botsColor[1], 700, 0, 300, 400);
    let txtSize = 15;
    this.g.strokeStyle = 'black';
    this.g.fillStyle = 'black';
    this.g.font = txtSize + 'px Arial';
    let str = [
      'Score: ' + this.score, //this.cols.getScore(),
      'HighScore: ' + this.highScore,
      'Update: ' + tostr(this.measuredUpdateTime) + ' ms',
      'Draw: ' + tostr(this.measuredDrawTime) + ' ms',
      'Epoch: ' + this.epoch,
      'GameSpeed: ' + tostr(this.gameSpeed)
      /*'Teperature: ' + tostr(this.bots[0].getTemperature()),
      'Distance: ' + tostr(this.birbs[0].getDistance()),
      'Jumped: ' + this.jumped*/
    ];
    let y = txtSize;
    for (let i = 0; i < str.length; i++){
      this.g.fillText(str[i], 5, y);
      y += txtSize;
    }
    this.g.fillText('Press \'r\' to speed up, or \'p\' to pause (capslock turned off)', 280, txtSize);
  }
  resetGame(){
    this.gameSpeed = 3;
    this.score = 0;
    this.cols.reset();
  }
  onButtonPressed(btn){
    switch (btn){
      case 'r':
        this.rewind = !this.rewind;
        if (this.rewind)
          this.updatesPerFrame = this.UPDATES_PER_FRAME_REWIND;
        else
          this.updatesPerFrame = this.UPDATES_PER_FRAME_NORMAL;
        break;
      case 'e':
        this.debug = !this.debug;
        break;
    }
  }
  onColumnPassed(){
    this.score++;
    if (this.score > this.highScore)
      this.highScore = this.score;
  }
}

let world = new World();
let isRunning = true, rewind = true, timestep = 50;
let intervalId = setInterval(gameLoop, timestep);

function gameLoop() {
  let a = performance.now();
  world.update();
  let b = performance.now();
  world.draw();
  let c = performance.now();
  world.measuredUpdateTime = b - a;
  world.measuredDrawTime = c - b;
}

window.onkeypress = function(evt){
  evt = evt || window.event;
  let charCode = evt.keyCode || evt.which;
  let charStr = String.fromCharCode(charCode);
  switch (charStr){
    case 'p':
      isRunning = !isRunning;
      if (isRunning)
        intervalId = setInterval(gameLoop, timestep);
      else
        clearInterval(intervalId);
      break;
    default:
      world.onButtonPressed(charStr);
      console.log('other button has been pressed');
  }
}
