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
    this.bots = [new BotGA(this, this.cols), new BotSA(this, this.cols)];
    //this.bots = [new BotSA(this, this.cols)];
    this.resetGame();
  }
  getHeight(){
    return this.height;
  }
  update(){
    for (let i = 0; i < this.updatesPerFrame; i++){
      let alive = 0;
      for (let bot of this.bots)
        if (bot.isAlive())
          alive++;
      if (alive == 0){
        this.resetGame();
        for (let bot of this.bots){
          bot.reset();
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
    this.g.lineWidth = 1;
    this.g.clearRect(0, 0, this.width, this.height);
    let once = true;
    for (let bot of this.bots){
      bot.draw(this.g);
      if (bot.isAlive() && once){
        bot.getNeuralNet().draw(this.g, 1000, 0, 300, 180);
        once = false;
      }
    }
    let txtSize = 15;
    this.g.font = txtSize + 'px Arial';
    let str = [
      'Score: ' + this.score, //this.cols.getScore(),
      'HighScore: ' + this.highScore,
      'Epoch: ' + this.epoch,
      /*'Teperature: ' + tostr(this.bots[0].getTemperature()),
      'Distance: ' + tostr(this.birbs[0].getDistance()),
      'Update: ' + tostr(this.measuredUpdateTime),
      'Draw: ' + tostr(this.measuredDrawTime),
      'Jumped: ' + this.jumped*/
    ];
    let y = txtSize;
    for (let i = 0; i < str.length; i++){
      this.g.fillText(str[i], 5, y);
      y += txtSize;
    }
    this.cols.draw(this.g);
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
        this.basicBot.reset();
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
