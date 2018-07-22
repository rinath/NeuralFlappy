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

function Columns(width, height){
  this.hole = 200;
  this.width = width;
  this.height = height;
  this.w = 30;
  this.score = 0;
  this.highScore = 0;
  this.cols = [];

  this.isColliding1 = function(birb, x, y, w, h){
    circleDistance_x = Math.abs(birb.x - x - w/2);
    circleDistance_y = Math.abs(birb.y - y - h/2);
    if (circleDistance_x > (w/2 + birb.r)) { return false; }
    if (circleDistance_y > (h/2 + birb.r)) { return false; }
    if (circleDistance_x <= (w/2)) { return true; }
    if (circleDistance_y <= (h/2)) { return true; }
    cornerDistance_sq = (circleDistance_x - w/2) * (circleDistance_x - w/2) +
                         (circleDistance_y - h/2) * (circleDistance_y - h/2);
    return (cornerDistance_sq <= (birb.r * birb.r));
  }

  this.isColliding = function(birb){
    for (var i = 0; i < this.cols.length; i++){
      if (this.isColliding1(birb, this.cols[i].x, 0, this.w, this.cols[i].h) ||
          this.isColliding1(birb, this.cols[i].x, this.cols[i].h + this.hole, this.w, this.height - this.cols[i].h - this.hole))
          return true;
    }
    return false;
  }

  this.nearestColumn = function(birb){
    for (var i = 0; i < this.cols.length; i++){
      if (this.cols[i].x > birb.x){
        return [this.cols[i].x - birb.x, this.cols[i].h - birb.y]
      }
    }
    return [0, 0];
  }

  this.update = function(gameSpeed){
    if (this.cols.length == 0 || this.width - this.cols[this.cols.length - 1].x > 400)
      this.cols.push({x: this.width, h: Math.random() * (this.height * 0.9 - this.hole) + this.height * 0.05});
    if (this.cols.length > 0 && this.cols[0].x < -this.w * 2){
      this.cols.splice(0, 1);
      this.score++;
      if (this.highScore < this.score)
        this.highScore = this.score;
    }
    for (var i = 0; i < this.cols.length; i++){
      this.cols[i].x -= gameSpeed;
    }
  }

  this.draw = function(g){
    for (var i = 0; i < this.cols.length; i++){
      g.rect(this.cols[i].x, 0, this.w, this.cols[i].h);
      g.rect(this.cols[i].x, this.cols[i].h + this.hole, this.w, this.height - this.cols[i].h - this.hole);
    }
    g.stroke();
  }

  this.getScore = function(){
    return this.score;
  }

  this.getHighScore = function(){
    return this.highScore;
  }

  this.resetScore = function(){
    this.score = 0;
  }
}
