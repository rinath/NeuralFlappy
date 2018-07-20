var canvas = document.getElementById('mycanvas');
var width = 600, height = 300;
canvas.width = width;
canvas.height = height;
var g = canvas.getContext('2d');

var birb, cols;
var collision;
startGame();
setInterval(updateGame, 20);

function startGame(){
  birb = new Birb(height);
  cols = new Columns(width, height);
}

function updateGame(){
  birb.update();
  cols.update();
  collision = cols.isColliding(birb);
  drawGame();
}

function drawGame(){
  g.clearRect(0, 0, width, height);
  birb.draw(g);
  cols.draw(g);
}

window.onkeypress = function(){
  birb.jump();
}
