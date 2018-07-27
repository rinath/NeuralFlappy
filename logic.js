function tostr(number){
  return Number(number).toFixed(2);
}

class World {

  constructor(){
    var canvas = document.getElementById('mycanvas');
    this.width = 600;
    this.height = 250;
    canvas.width = this.width;
    canvas.height = this.height;
    this.g = canvas.getContext('2d');
    this.UPDATES_PER_FRAME_NORMAL = 1;
    this.UPDATES_PER_FRAME_REWIND = 2000;
    this.updatesPerFrame = this.UPDATES_PER_FRAME_NORMAL;
    this.highScore = 0;
    this.rewind = false;
    this.initializeGame();
    this.measuredUpdateTime = 0;
    this.measuredDrawTime = 0;
  }

  initializeGame(){
    this.cols = new Columns(this.width, this.height);
    this.birbs = [];
    this.bots = [];
    for (let i = 0; i < 1; i++){
      this.birbs.push(new Birb(this.height, this.cols));
      this.bots.push(new Bot(this.birbs[i], this.cols));
    }
    this.resetGameSpeed();
  }

  update(){
    for (let i = 0; i < this.updatesPerFrame; i++){
      for (let i = 0; i < this.birbs.length; i++){
        this.bots[i].update(this.gameSpeed);
        this.birbs[i].update(this.gameSpeed);
        if (this.cols.isColliding(this.birbs[i])){
          this.bots[i].onCollision();
          this.resetGameSpeed();
          this.cols.resetScore();
        }
      }
      this.cols.update(this.gameSpeed);
      this.gameSpeed += 0.001;
    }
  }

  draw(){
    this.g.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.birbs.length; i++){
      this.birbs[i].draw(this.g);
    }
    let txtSize = 15;
    this.g.font = txtSize + 'px Arial';
    if (this.highScore < this.cols.getScore())
      this.highScore = this.cols.getScore();
    let str = [
      'Score: ' + this.cols.getScore(),
      'HighScore: ' + this.highScore,
      'Epoch: ' + this.bots[0].getEpoch(),
      'Teperature: ' + Number(this.bots[0].getTemperature()).toFixed(2),
      'Distance: ' + Number(this.birbs[0].getDistance()).toFixed(2),
      'Update: ' + tostr(this.measuredUpdateTime),
      'Draw: ' + tostr(this.measuredDrawTime)
    ];
    let y = txtSize;
    for (let i = 0; i < str.length; i++){
      this.g.fillText(str[i], 5, y);
      y += txtSize;
    }
    this.cols.draw(this.g);
  }

  resetGameSpeed(){
    this.gameSpeed = 3;
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
      default:
        this.birbs[0].jump();
    }
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
