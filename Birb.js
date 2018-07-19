function Birb(height){
  this.height = height;
  this.x = 50;
  this.y = height / 2;
  this.vel = 0;
  this.r = 15;

  this.jump = function(){
    this.vel = -10;
  }

  this.onCollision = function(){
    console.log('collision');
  }

  this.update = function(){
    this.vel += 0.5;
    this.y += this.vel;
    if (this.y < this.r)
      this.y = this.r;
    else if (this.y > this.height - this.r)
      this.y = this.height - this.r;
  }

  this.draw = function(g){
    g.beginPath();
    g.arc(this.x, this.y, this.r, 0, 7);
    g.stroke();
  }
}
