var canvas = document.getElementById('mycanvas');
var width = 600, height = 250;
canvas.width = width;
canvas.height = height;
var g = canvas.getContext('2d');
var rewind = false;

var birb, cols, bot, birbs, bots;
var gameSpeed = 1, timestep = 50, isRunning = true;
var UPDATES_PER_FRAME = 4, UPDATES_PER_FRAME_REWIND = 2000;
resetGameSpeed();
startGame();
var intervalId;

function startGame(){
  cols = new Columns(width, height);
  birbs = [];
  bots = [];
  for (let i = 0; i < 1; i++){
    birbs.push(new Birb(height, cols));
    bots.push(new Bot(birbs[i], cols));
  }
  intervalId = setInterval(updateGame, timestep);
}

function updateGame(){
  let updates = UPDATES_PER_FRAME;
  if (rewind)
    updates = UPDATES_PER_FRAME_REWIND;
  for (let i = 0; i < updates; i++){
    for (let i = 0; i < birbs.length; i++){
      bots[i].update(gameSpeed);
      birbs[i].update(gameSpeed);
      if (this.cols.isColliding(birbs[i])){
        bots[i].onCollision();
        resetGameSpeed();
        cols.resetScore();
      }
    }
    cols.update(gameSpeed);
    gameSpeed += 0.001;
  }
  drawGame();
}

let highScore = 0;
function drawGame(){
  g.clearRect(0, 0, width, height);
  for (let i = 0; i < birbs.length; i++){
    birbs[i].draw(g);
  }
  g.font = "15px Arial";
  if (highScore < this.cols.getScore())
    highScore = this.cols.getScore();
  g.fillText("Score: " + this.cols.getScore(), 10, 15);
  g.fillText("HighScore: " + highScore, 10, 30);
  g.fillText("Epoch: " + this.bots[0].getEpoch(), 10, 45);
  g.fillText("Teperature: " + Number(this.bots[0].getTemperature()).toFixed(2), 10, 60);
  g.fillText("Distance: " + Number(this.birbs[0].getDistance()).toFixed(2), 10, 75);
  cols.draw(g);
}

function resetGameSpeed(){
  gameSpeed = 3;
}

window.onkeypress = function(evt){
  evt = evt || window.event;
  var charCode = evt.keyCode || evt.which;
  var charStr = String.fromCharCode(charCode);
  if (charStr == 'p'){
    if (isRunning)
      clearInterval(intervalId);
    else
      intervalId = setInterval(updateGame, timestep);
    isRunning = !isRunning;
  }
  else if (charStr == 'r')
    rewind = !rewind;
  else
    birbs[0].jump();
}
