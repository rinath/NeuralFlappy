function Column(width, height){
  this.w = 30;
  this.hole = 100;
  this.x = width;
  this.height = height;
  this.h = Math.random() * (height * 0.9 - this.hole) + height * 0.05;

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
    return this.isColliding1(birb, this.x, 0, this.w, this.h) ||
        this.isColliding1(birb, this.x, this.h + this.hole, this.w, this.height - this.h - this.hole);
  }

  this.update = function(){
    this.x -= 3;
  }

  this.draw = function(g){
    g.rect(this.x, 0, this.w, this.h);
    g.rect(this.x, this.h + this.hole, this.w, this.height - this.h - this.hole);
    g.stroke();
  }
}
