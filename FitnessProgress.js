class FitnessProgress {
  constructor(names, colors){
    this.fitness = [];
    this.colors = colors;
    this.names = names;
    for (let a of this.colors)
      this.fitness.push([]);
  }
  addFitness(i, value){
    this.fitness[i].push(value);
  }
  borderValue(arr, max=true){
    let sign = 1;
    if (!max)
      sign = -1;
    let ans = arr[0][0];
    for (let vec of arr)
      for (let val of vec)
        if (ans * sign < val * sign)
          ans = val;
    if (ans * sign < 0)
      return 0;
    return ans;
  }
  draw(g, x, y, w, h){
    g.strokeStyle = 'black';
    g.beginPath();
    g.clearRect(x, y, w, h);
    g.rect(x, y, w, h);
    g.stroke();
    let max = this.borderValue(this.fitness);
    let min = this.borderValue(this.fitness, false);
    let txtSize = 15;
    g.font = txtSize + 'px Arial';
    g.fillStyle = 'black';
    g.fillText('Fitnesses for:', x + 5, y + txtSize);
    for (let i = 0; i < this.fitness.length; i++){
      g.strokeStyle = 'black';
      g.beginPath();
      g.moveTo(x, y + h * max / (max - min));
      g.lineTo(x + w, y + h * max / (max - min));
      g.stroke();
      g.strokeStyle = this.colors[i];
      g.fillStyle = this.colors[i];
      for (let j = 0; j < this.fitness[i].length; j++){
        g.beginPath();
        g.rect(x + j * w / (this.fitness[i].length - 1), y + h * (max - this.fitness[i][j]) / (max - min), 3, 3);
        g.fill();
      }
      g.fillText(this.names[i], x + 5, y + txtSize * (i + 2));
    }
  }
}
