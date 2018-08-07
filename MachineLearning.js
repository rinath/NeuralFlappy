function tostr(number){
  return Number(number).toFixed(6);
}
class SimulatedAnnealing {
  constructor(n, initialTemperature, temperatureFactor, maximizeFitness){ // n - amount of data points
    if (maximizeFitness)
      this.maximizeFitness = 1;
    else
      this.maximizeFitness = -1;
    this.prevData = [];
    this.data = [];
    for (let i = 0; i < n; i++){
      this.prevData.push(Math.random() * 20 - 10);
      this.data.push(this.prevData[i]);
    }
    this.fitness = 100000;
    if (maximizeFitness)
      this.fitness = 0;
    this.previousFitness = this.fitness;
    this.temperature = initialTemperature;
    this.temperatureFactor = temperatureFactor;
    this.probability = 0;
  }
  generateState(){
    let updateWeights = 1;
    for (let i = 0; i < this.prevData.length; i++){
      if (updateWeights > Math.random())
        this.data[i] = this.prevData[i] + this.temperature * (Math.random() * 2 - 1);
      else
        this.data[i] = this.prevData[i];
    }
    return this.data;
  }
  updateState(fitness){
    this.fitness = fitness;
    console.log('p:' + Math.exp(this.maximizeFitness * (this.fitness - this.previousFitness) / this.temperature)
      + ', f:' + this.fitness + ', pf:' + this.previousFitness + ', t:' + this.temperature
      + ', (f-pf)*mf:' + this.maximizeFitness * (this.fitness - this.previousFitness) + ', (f-pf)*mf/t/10 :'
      + this.maximizeFitness * (this.fitness - this.previousFitness) / this.temperature);
    if ((this.previousFitness - this.fitness) * this.maximizeFitness <= 0
      || Math.exp(this.maximizeFitness * (this.fitness - this.previousFitness) / this.temperature) > Math.random() ){
      for (let i = 0; i < this.data.length; i++)
        this.prevData[i] = this.data[i];
        this.previousFitness = this.fitness;
        this.temperature *= this.temperatureFactor;
    }
    else {
      console.log('data point is not accepted');
    }
  }
  getFitness(){
    return this.fitness;
  }
  getTemperature(){
    return this.temperature;
  }
}

// Real Coded Genetic Algorithm
class RCGA {
  constructor(population, mutationRate, maximizeFitness = true){
    if (maximizeFitness)
      this.maximizeFitness = 1;
    else
      this.maximizeFitness = -1;
    this.data = [[], []];
    this.fitness = [];
    this.maxFitness = 100000;
    if (maximizeFitness)
      this.maxFitness = 0;
    this.fittest = [];
    this.parents = [];
    this.population = 0;
    this.addCreature(population, maximizeFitness);
    this.featureLowerBound = [];
    this.featureUpperBound = [];
    this.epoch = 0;
    this.features = 0;
    this.active = 0; // active generation, in double buffer, either 0 or 1
    this.mutationRate = mutationRate;
  }
  addFeature(lowerBound, upperBound, amount = 1){
    this.features += amount;
    if (lowerBound > upperBound)
      [lowerBound, upperBound] = [upperBound, lowerBound];
    for (let i = 0; i < amount; i++){
      this.featureLowerBound.push(lowerBound);
      this.featureUpperBound.push(upperBound);
      for (let j = 0; j < this.population; j++){
        let val = Math.random() * (upperBound - lowerBound) + lowerBound;
        this.data[0][j].push(val);
        this.data[1][j].push(val);
      }
      this.fittest.push(Math.random() * (upperBound - lowerBound) + lowerBound);
    }
  }
  addCreature(amount, maximizeFitness){
    for (let i = 0; i < amount; i++){
      this.data[0].push([]);
      this.data[1].push([]);
      this.fitness.push(100000);
      this.parents.push([0, 0]);
      if (maximizeFitness)
        this.fitness[i] = 0;
    }
    this.population += amount;
  }
  getCreature(i){
    return this.data[this.active][i];
  }
  getPopulation(){
    return this.population;
  }
  getFittest(){
    let index = 0;
    for (let i = 0; i < this.fitness.length; i++){
      if (this.fitness[index] < this.fitness[i])
        index = i;
    }
    return this.data[this.active][index];
  }
  getFittestIndex(){
    let index = 0;
    for (let i = 0; i < this.fitness.length; i++){
      if (this.fitness[index] < this.fitness[i])
        index = i;
    }
    return index;
  }
  getFittestFitness(){
    return this.fitness[this.getFittestIndex()];
  }
  setFitness(i, value){
    this.fitness[i] = value;
  }
  newEpoch(){
    this.epoch++;
    this.tournamentSelection();
    let fittestIndex = this.getFittestIndex();
    console.log('maxFitness:' + this.maxFitness + ', fitness[fittestIndex]:' + this.fitness[fittestIndex]);
    if (this.maxFitness < this.fitness[fittestIndex]){
      this.maxFitness = this.fitness[fittestIndex];
      for (let i = 0; i < this.features; i++)
        this.fittest[i] = this.data[this.active][fittestIndex][i];
      console.log('new maxFitness:' + this.maxFitness + ', data:', this.fittest);
    }
    for (let i = 0; i < this.features; i++)
      this.data[1 - this.active][0][i] = this.fittest[i];
    console.log('this.data[1-active][0]', this.data[1 - this.active][0]);
    for (let i = 1; i < this.parents.length; i++){
      this.nPointCrossover(this.data[this.active][this.parents[i][0]], this.data[this.active][this.parents[i][1]],
        this.data[1 - this.active][i]);
    }
    for (let i = 1; i < this.population; i++)
      if (this.mutationRate > Math.random())
        this.mutate(this.data[1 - this.active][i]);
    this.active = 1 - this.active;
  }
  simpleCrossover(mother, father, child){
    let index = Math.floor(Math.random() * this.features);
    for (let i = 0; i < index; i++)
      child[i] = mother[i];
    for (let i = index; i < this.features; i++)
      child[i] = father[i];
  }
  nPointCrossover(mother, father, child){
    for (let i = 0; i < this.features; i++){
      if (i % 2 == 0)
        child[i] = mother[i];
      else
        child[i] = father[i];
    }
  }
  blxCrossover(mother, father, child){
    let crossoverRange = 0.5;
    for (let i = 0; i < this.features; i++){
      let higher = father[i];
      let lower = mother[i];
      if (father[i] < mother[i]){
        higher = mother[i];
        lower = father[i];
      }
      child[i] = lower - (higher - lower) * crossoverRange + Math.random() * (higher - lower) * (1 + 2 * crossoverRange);
    }
  }
  mutate(creature){
    let eta = 20;
    let probability = 5 / this.features;
    for (let i = 0; i < this.features; i++){
      if (probability > Math.random()){
        let u = Math.random();
        if (u > 0.5){
          let delta = 1 - Math.pow(2 * (1 - u), 1 / (1 + eta));
          creature[i] += delta * (this.featureUpperBound[i] - creature[i]);
        }
        else {
          let delta = Math.pow(2 * u, 1 / (1 + eta)) - 1;
          creature[i] += delta * (creature[i] - this.featureLowerBound[i]);
        }
      }
    }
  }
  tournamentSelection(k = 3){
    let candidates = new Array(k);
    for (let i = 0; i < 2 * this.parents.length; i++){
      let parent = 0;
      for (let j = 0; j < k; j++){
        candidates[j] = Math.floor(Math.random() * this.population);
        if (j == 0)
          parent = candidates[j];
        else if (this.fitness[parent] < this.fitness[candidates[j]])
          parent = candidates[j];
      }
      this.parents[Math.floor(i / 2)][i % 2] = parent;
    }
  }
  showData(){
    let count = new Array(this.population);
    for (let i = 0; i < this.population; i++)
      count[i] = 0;
    for (let i = 0; i < this.population; i++){
      count[this.parents[i][0]]++;
      count[this.parents[i][1]]++;
    }
    for (let i = 0; i < this.data[this.active].length; i++){
      let str = this.active + ', ' + i + ' -- fit:' + tostr(this.fitness[i]) + ', count:' + count[i]
        + ', mother:' + this.parents[i][0]
        + ', father:' + this.parents[i][1] + ' \t\t* ';
      for (let j = 0; j < this.data[0][i].length; j++){
        str += tostr(this.data[0][i][j]) + ', ';
      }
      str += ' => ';
      for (let j = 0; j < this.data[1][i].length; j++){
        str += tostr(this.data[1][i][j]) + ', ';
      }
      console.log(str);
    }
  }
}

class NeuralNetwork {
  constructor(){
    this.weights = [];
    this.outputs = [];
    this.inputs = [];
    let str = '';
    for (let i = 0; i < arguments.length; i++){
      arguments[i]++;
      str += arguments[i] + ', ';
    }
    for (let i = 0; i < arguments.length; i++){
      this.outputs.push([]);
      this.inputs.push([]);
      for (let j = 0; j < arguments[i]; j++){
        this.outputs[i].push(1);
        this.inputs[i].push(1);
      }
    }
    this.countWeights = 0;
    for (let i = 1; i < arguments.length; i++){
      let tmp = [];
      for (let j = 0; j < arguments[i] - 1; j++){
        tmp.push([]);
        for (let k = 0; k < arguments[i - 1]; k++){
          //tmp[j].push(this.countWeights);
          tmp[j].push(Math.random() * 2 - 1);
          this.countWeights++;
        }
      }
      let str = '';
      for (let i = 0; i < tmp.length; i++)
        str += '[' + tmp[i] + '], ';
      //console.log('tmp: ' + str);
      this.weights.push(tmp);
    }
    /*console.log('weights:');
    console.log(this.weights);
    console.log('outputs:');
    console.log(this.outputs);
    console.log('inputs:');
    console.log(this.inputs);
    console.log('count:' + this.countWeights);*/
  }

  setWeights(weights){
    if (weights.length != this.countWeights)
      console.log('ERROR ### Bot.setWeights, incorrect amount of weights');
    //console.log('NN.setWeights:');
    let ind = 0;
    for (let i = 0; i < this.weights.length; i++)
      for (let j = 0; j < this.weights[i].length; j++)
        for (let k = 0; k < this.weights[i][j].length; k++)
          this.weights[i][j][k] = weights[ind++];
    //this.showWeights();
  }

  showWeights(){
    let str = '';
    for (let i = 0; i < this.weights.length; i++){
      str += '{';
      for (let j = 0; j < this.weights[i].length; j++){
        str += '[';
        for (let k = 0; k < this.weights[i][j].length; k++){
          str += Number(this.weights[i][j][k]).toFixed(3) + ', ';
        }
        str += '], ';
      }
      str += '}';
    }
    console.log('weights:' + str);
  }

  getAmountOfWeights(){
    return this.countWeights;
  }

  forwardPropagation(inputs){
    for (let i = 0; i < inputs.length; i++){
      this.outputs[0][i] = inputs[i];
      this.inputs[0][i] = inputs[i];
    }
    if (inputs.length != this.weights[0][0].length - 1)
      console.log('ERROR ### forwardProp, incorrect number of arguments');
    for (let i = 0; i < this.weights.length; i++){
      for (let j = 0; j < this.weights[i].length; j++){
        this.outputs[i + 1][j] = 0;
        this.inputs[i + 1][j] = 0;
        for (let k = 0; k < this.weights[i][j].length; k++){
          this.outputs[i + 1][j] += this.outputs[i][k] * this.weights[i][j][k];
          this.inputs[i + 1][j] += this.outputs[i][k] * this.weights[i][j][k];
        }
        this.outputs[i + 1][j] = this.sigmoidActivation(this.outputs[i + 1][j]);
      }
    }
    return this.outputs[this.outputs.length - 1];
  }

  hardTanhActivation(x){
    if (x < -1)
      return -1;
    else if (x > 1)
      return 1;
    return x;
  }

  stepActivation(x){
    if (x > 0)
      return 1;
    return 0;
  }

  sigmoidActivation(x){
    return 1 / (1 + Math.exp(-x));
  }

  draw(g, x, y, w, h){
    g.clearRect(x, y, w, h);
    g.strokeStyle = 'black';
    g.beginPath();
    g.rect(x, y, w, h);
    g.stroke();
    let fontsize = 10;
    g.font = fontsize + 'px Arial';
    let r = 5;
    let xstart = x + 4 * r, ystart = y + 2 * r;
    let xdistance = (w - 12 * r) / this.weights.length;
    let negativeColor = [0, 0, 255];
    let positiveColor = [255, 0, 0];
    let zeroColor = [255, 255, 255];
    for (let i = 0; i < this.weights.length; i++){
      let rightydistance = (h - 4 * r - fontsize) / (this.weights[i].length);
      for (let j = 0; j < this.weights[i].length; j++){
        let average = 0;
        let averageWeight = 0;
        for (let k = 0; k < this.weights[i][j].length; k++){
          average += Math.abs(this.weights[i][j][k] * this.outputs[i][k]);
          averageWeight += Math.abs(this.weights[i][j][k]);
        }
        average /= this.weights[i][j].length;
        averageWeight /= this.weights[i][j].length;
        let leftydistance = (h - 4 * r - fontsize) / (this.weights[i][j].length - 1);
        for (let k = 0; k < this.weights[i][j].length; k++){
          g.beginPath();
          let color = this.hardTanhActivation(this.weights[i][j][k] * this.outputs[i][k] / average / 2);
          let str = 'rgb(';
          for (let l = 0; l < 3; l++){
            if (color > 0){
              str += (positiveColor[l] * color + zeroColor[l] * (1 - color));
            }
            else {
              str += (-negativeColor[l] * color + zeroColor[l] * (1 + color));
            }
            if (l < 2)
              str += ',';
          }
          //g.strokeStyle = 'rgb(' + (127 + 126 * color) + ',0,' + (127 - 126 * color) + ')';
          g.strokeStyle = str + ')';
          g.lineWidth = this.hardTanhActivation(this.weights[i][j][k] / averageWeight / 2) * 6 + 1;
          g.moveTo(xstart + xdistance * i, ystart + leftydistance * k);
          g.lineTo(xstart + xdistance * (i + 1), ystart + rightydistance * j);
          g.stroke();
          /*g.fillText(tostr(this.weights[i][j][k]),
            xstart + xdistance * (2 * i + 1) / 2,
            ystart + (leftydistance * k + rightydistance * j) / 2);*/
        }
      }
    }
    g.lineWidth = 1;
    g.strokeStyle = 'black';
    g.beginPath();
    for (let i = 0; i < this.outputs.length; i++){
      let ydistance = (h - 4 * r - fontsize) / (this.outputs[i].length - 1);
      for (let j = 0; j < this.outputs[i].length; j++){
        if (i == this.outputs.length - 1 && j == this.outputs[i].length - 1)
          continue;
        g.arc(xstart + xdistance * i, ystart + ydistance * j, r, 0, 7);
        let str = '';
        if (i == 0)
          str = tostr(this.inputs[i][j]);
        else
          str = tostr(this.inputs[i][j]) + ' > ' + tostr(this.outputs[i][j]);
        g.fillText(str, xstart + xdistance * i - g.measureText(str).width / 2, ystart + ydistance * j + r + fontsize + 3);
      }
    }
    g.stroke();
  }
}
