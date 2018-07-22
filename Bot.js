function Bot(birb, cols){
  this.birb = birb;
  this.cols = cols;
  this.nn = new NeuralNetwork(5, 3, 2);

  var frame = 0;
  this.update = function(gameSpeed){
    /*frame++;
    //if (frame % 39 == 0){
      frame = 0;
      this.birb.jump();
    }
    */
    var nearestColumn = this.cols.nearestColumn(this.birb);
    var data = nearestColumn.concat([this.birb.vel, gameSpeed]);
    //console.log(data);
    let output = this.nn.forwardPropagation(data);
    //console.log('forwardProp:' + output);
    if (output[0] > 0)
      this.birb.jump();
  }
}
