// Inspired by https://codepen.io/jackrugile/pen/nBNLMQ
var cw = 300,
    ch = 300,
    parts = [],
    partCount = 200,
    partsFull = false,
    hueRange = 50,
    globalTick = 0,
    rand = function(min, max){
        return Math.floor( (Math.random() * (max - min + 1) ) + min);
    };
const Part = function(position, radiusrange){
  this.reset(position, radiusrange);
};

Part.prototype.reset = function(position, radiusRange){
  this.startRadius = rand(1, radiusRange.max);
  this.radius = this.startRadius;
  this.x = position.x;
  this.y = position.y;
  this.vx = 0;
  this.vy = 0;
  this.hue = rand(globalTick - hueRange, globalTick + hueRange);
  this.saturation = rand(50, 100);
  this.lightness = rand(20, 70);
  this.startAlpha = rand(1, 10) / 100;
  this.alpha = this.startAlpha;
  this.decayRate = .1;
  this.startLife = 7;
  this.life = this.startLife;
  this.lineWidth = rand(1, 3);
}

Part.prototype.update = function(position, radiusRange){
  this.vx += (rand(0, 200) - 100) / 1500;
  this.vy -= this.life/50;
  this.x += this.vx;
  this.y += this.vy;
  this.alpha = this.startAlpha * (this.life / this.startLife);
  this.radius = this.startRadius * (this.life / this.startLife);
  this.life -= this.decayRate;
  if(
    this.x > cw + this.radius ||
    this.x < -this.radius ||
    this.y > ch + this.radius ||
    this.y < -this.radius ||
    this.life <= this.decayRate
  ){
    this.reset(position, radiusRange);
  }
};

Part.prototype.render = function(ctx){
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, '+this.alpha+')';
  ctx.lineWidth = this.lineWidth;
  ctx.fill();
  ctx.stroke();
};

const createParts = function(position, radiusRange){
  // console.log(radiusRange)
  if(!partsFull){
    if(parts.length > partCount){
      partsFull = true;
    } else {
      if(radiusRange === undefined) {
        consol.log(radiusRange)
        return
      }
      parts.push(new Part(position, radiusRange));
    }
  }
};

const updateParts = function(position, radiusRange){
  let i = parts.length;
  while(i--){
    parts[i].update(position, radiusRange);
  }
};

const renderParts = function(ctx){
  let i = parts.length;
  while(i--){
    parts[i].render(ctx);
  }
};

export {
  Part,
  createParts,
  updateParts,
  renderParts
}

// var clear = function(){
//   ctx.globalCompositeOperation = 'destination-out';
//   ctx.fillStyle = 'hsla(0, 0%, 0%, .3)';
//   ctx.fillRect(0, 0, cw, ch);
//   ctx.globalCompositeOperation = 'lighter';
// };

// var loop = function(){
//   window.requestAnimFrame(loop, c);
//   clear();
//   createParts();
//   updateParts();
//   renderParts();
//   globalTick++;
// };