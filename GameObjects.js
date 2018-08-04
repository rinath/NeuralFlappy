class Birb {

  constructor(height, cols){
    this.cols = cols;
    this.height = height;
    this.x = 150;// + Math.random() * 150;
    this.y = height / 2;
    this.vel = 0;
    this.r = 15;
    this.distance = 0;
    this.frame = 0;
    this.skipFrames = 3;
    this.columnCollisionFrame = -1;
    let n = 20;
    this.tail = [];
    for (var i = 0; i < n; i++)
      this.tail.push([this.x, this.y]);
  }

  jump(){
    this.vel = -3.5;
  }

  onWallCollision(){
  }

  onColumnCollision(){
    this.columnCollisionFrame = 2;
  }

  onColumnLastCollision(){
  }

  setWallCollisionHandler(func){
    this.onWallCollision = func;
  }

  setColumnLastCollisionHandler(func){
    this.onColumnLastCollision = func;
  }

  setColumnCollisionHandler(func){
    this.onColumnCollision = func;
  }

  getDistance(){
    return this.distance;
  }

  getNearestColumn(){
    return this.cols.nearestColumn(this);
  }

  getY(){
    return this.y;
  }

  resetDistance(){
    this.distance = 0;
  }

  update(gameSpeed){
    this.distance += gameSpeed;
    this.frame++;
    this.vel += 0.1;
    let prevy = this.y;
    this.y += this.vel;
    if (this.y < this.r || this.y > this.height - this.r){
      this.y = this.height / 2;
      this.vel = 0;
      this.onWallCollision();
    }
    if (this.frame % this.skipFrames == 0){
      this.frame = 0;
      for (var i = 0; i < this.tail.length - 1; i++){
        this.tail[i][0] = this.tail[i + 1][0] - gameSpeed * this.skipFrames;
        this.tail[i][1] = this.tail[i + 1][1];
      }
      this.tail[this.tail.length - 1][0] = this.x;
      this.tail[this.tail.length - 1][1] = this.y;
    }
    if (this.cols.isColliding(this))
      this.onColumnCollision();
    this.columnCollisionFrame--;
    if (this.columnCollisionFrame == -1)
      this.onColumnLastCollision();
  }

  draw(g, color){
    g.strokeStyle = color;
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

class Columns {

  constructor(width, height){
    this.hole = 150;
    this.width = width;
    this.height = height;
    this.w = 30;
    this.cols = [];
  }

  isColliding1(birb, x, y, w, h){
    let circleDistance_x = Math.abs(birb.x - x - w/2);
    let circleDistance_y = Math.abs(birb.y - y - h/2);
    if (circleDistance_x > (w/2 + birb.r)) { return false; }
    if (circleDistance_y > (h/2 + birb.r)) { return false; }
    if (circleDistance_x <= (w/2)) { return true; }
    if (circleDistance_y <= (h/2)) { return true; }
    let cornerDistance_sq = (circleDistance_x - w/2) * (circleDistance_x - w/2) +
                         (circleDistance_y - h/2) * (circleDistance_y - h/2);
    return (cornerDistance_sq <= (birb.r * birb.r));
  }

  isColliding(birb){
    for (var i = 0; i < this.cols.length; i++){
      if (this.isColliding1(birb, this.cols[i].x, 0, this.w, this.cols[i].h) ||
          this.isColliding1(birb, this.cols[i].x, this.cols[i].h + this.hole, this.w, this.height - this.cols[i].h - this.hole))
          return true;
    }
    return false;
  }

  nearestColumn(birb){
    for (var i = 0; i < this.cols.length; i++){
      if (this.cols[i].x > birb.x){
        return [this.cols[i].x + this.w - birb.x, this.cols[i].h - birb.getY() + this.hole / 2];
      }
    }
    return [0, 0];
  }

  reset(){
    this.cols = [];
  }

  update(gameSpeed){
    if (this.cols.length == 0 || this.width - this.cols[this.cols.length - 1].x > 600)
      this.cols.push({x: this.width, h: Math.random() * (this.height * 0.9 - this.hole) + this.height * 0.05});
    if (this.cols.length > 0 && this.cols[0].x < -this.w * 2){
      this.onColumnPassed();
      this.cols.splice(0, 1);
    }
    for (var i = 0; i < this.cols.length; i++){
      this.cols[i].x -= gameSpeed;
    }
  }

  draw(g){
    g.strokeStyle = 'black';
    g.beginPath();
    for (var i = 0; i < this.cols.length; i++){
      g.rect(this.cols[i].x, 0, this.w, this.cols[i].h);
      g.rect(this.cols[i].x, this.cols[i].h + this.hole, this.w, this.height - this.cols[i].h - this.hole);
    }
    g.stroke();
  }

  onColumnPassed(){
  }

  setOnColumnPassedHandler(func){
    this.onColumnPassed = func;
  }
}
