function Columns(width, height){
  this.hole = 100;
  this.width = width;
  this.height = height;
  this.w = 30;
  //this.h = [];//Math.random() * (height * 0.9 - this.hole) + height * 0.05;
  //this.x = [];
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
    if (this.cols.length > 0 && this.cols[0].x < this.cols[0].w - this.hole * 2)
      this.cols.splice(0, 1);
    if (this.cols.length == 0 || this.width - this.cols[this.cols.length - 1].x > 400)
      this.cols.push({x: this.width, h: Math.random() * (this.height * 0.9 - this.hole) + this.height * 0.05});
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
}
