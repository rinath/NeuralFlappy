var canvas = document.getElementById('mycanvas');
var width = 600, height = 300;
canvas.width = width;
canvas.height = height;
var g = canvas.getContext('2d');
g.moveTo(10, 10);
g.lineTo(500, 150);
g.stroke();

var birb;
var cols = [];
startGame();
setInterval(updateGame, 20);

function startGame(){
  birb = new Birb(height);
  cols = [];
}

function updateGame(){
  birb.update();

  if (cols.length > 0 && cols[0].x < cols[0].w - cols[0].hole * 2)
    cols.splice(0, 1);
  if (cols.length == 0 || width - cols[cols.length - 1].x > 200)
    cols.push(new Column(width, height));
  for (var i = 0; i < cols.length; i++){
    cols[i].update();
    if (cols[i].isColliding(birb))
      birb.onCollision();
  }

  drawGame();
}

function drawGame(){
  g.clearRect(0, 0, width, height);
  birb.draw(g);
  for (var i = 0; i < cols.length; i++)
    cols[i].draw(g);
}

window.onkeypress = function(){
  birb.jump();
}
