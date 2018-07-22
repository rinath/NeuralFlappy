var canvas = document.getElementById('mycanvas');
var width = 1300, height = 300;
canvas.width = width;
canvas.height = height;
var g = canvas.getContext('2d');

var birb, cols, bot, birbs, bots;
var gameSpeed = 3, timestep = 50, isRunning = true;
var UPDATES_PER_FRAME = 5;
startGame();
var intervalId;

function startGame(){
  birb = new Birb(height);
  cols = new Columns(width, height);
  bot = new Bot(birb, cols);
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
    bot.update(gameSpeed);
    birb.update(gameSpeed);
    for (let i = 0; i < birbs.length; i++){
      bots[i].update(gameSpeed);
      birbs[i].update(gameSpeed);
    }
    cols.update(gameSpeed);
    if (cols.isColliding(birb))
      birb.onCollision();
    gameSpeed += 0.001;
  }
  drawGame();
}

function drawGame(){
  g.clearRect(0, 0, width, height);
  birb.draw(g);
  for (let i = 0; i < birbs.length; i++){
    birbs[i].draw(g);
  }
  cols.draw(g);
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
    birb.jump();
}
