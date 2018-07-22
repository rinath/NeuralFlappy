var canvas = document.getElementById('mycanvas');
var width = 1300, height = 300;
canvas.width = width;
canvas.height = height;
var g = canvas.getContext('2d');

var birb, cols, bot, birbs, bots;
var gameSpeed = 1, timestep = 50, isRunning = true;
var UPDATES_PER_FRAME = 4;
resetGameSpeed();
startGame();
var intervalId;

function startGame(){
  cols = new Columns(width, height);
  birbs = [];
  bots = [];
  for (let i = 0; i < 1; i++){
    birbs.push(new Birb(height));
    bots.push(new Bot(birbs[i], cols));
  }
  intervalId = setInterval(updateGame, timestep);
}

function updateGame(){
  for (let i = 0; i < UPDATES_PER_FRAME; i++){
    for (let i = 0; i < birbs.length; i++){
      bots[i].update(gameSpeed, cols.getScore());
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

function drawGame(){
  g.clearRect(0, 0, width, height);
  for (let i = 0; i < birbs.length; i++){
    birbs[i].draw(g);
  }
  g.font = "30px Arial";
  g.fillText("Score: " + this.cols.getScore(),10,50);
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
  else
    birbs[0].jump();
}
