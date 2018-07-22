function Birb(height){
  this.height = height;
  this.x = 150;
  this.y = height / 2;
  this.vel = 0;
  this.r = 15;

  let n = 5;
  this.tail = [];
  for (var i = 0; i < n; i++)
    this.tail.push([this.x, this.y]);

  this.jump = function(){
    this.vel = -10;
  }

  this.onCollision = function(){
  }

  let frame = 0, skipFrames = 3;
  this.update = function(gameSpeed){
    frame++;
    this.vel += 0.5;
    this.y += this.vel;
    if (this.y < this.r)
      this.y = this.r;
    else if (this.y > this.height - this.r)
      this.y = this.height - this.r;
    if (frame % skipFrames == 0){
      frame = 0;
      for (var i = 0; i < this.tail.length - 1; i++){
        this.tail[i][0] = this.tail[i + 1][0] - gameSpeed * skipFrames;
        this.tail[i][1] = this.tail[i + 1][1];
      }
      this.tail[this.tail.length - 1][0] = this.x;
      this.tail[this.tail.length - 1][1] = this.y;
    }
  }

  this.draw = function(g){
    g.beginPath();
    g.arc(this.x, this.y, this.r, 0, 7);
    g.stroke();
    g.beginPath();
    g.moveTo(this.tail[0][0], this.tail[0][1]);
    for (var i = 1; i < this.tail.length; i++){
      g.lineTo(this.tail[i][0], this.tail[i][1]);
    }
    g.stroke();
    //console.log('tail:' + this.tail);
  }
}
