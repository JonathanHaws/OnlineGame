
const express = require('express');
const app     = express();
const http    = require('http');
const server  = http.createServer(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3001;

class Game {
  constructor(maxPlayers, tickrate){
    this.interval = setInterval(()=> this.tick(), 1000/tickrate); 
    this.maxPlayers = maxPlayers;
    this.players = {};
    this.objects = [];
  }
  join(player){
    if (Object.keys(this.players).length >= this.maxPlayers){
      console.log('Game Is Full');
      player.disconnect();
      return;
    }
    console.log(`Player ${player.id} Joined`);
    this.players[player.id] = new this.Player(0, 0, player.handshake.query.name || 'player');
    player.on('input',(input)=>{ 
      this.players[player.id].input = input
    })    
    player.on('disconnect',()=>{ 
      console.log(`Player ${player.id} Left`);
      delete this.players[player.id];
    });
  }
  tick(){
    this.clientData = { sprites: [], sounds:[], text:[], circles:[] };
    this.objects.forEach(object => object.tick(this));
    Object.values(this.players).forEach(player => {player.tick(this);});
    Object.keys(this.players).forEach(player => {io.to(player).emit('tick', this.clientData);});
  }
  draw(x, y, sprite){
    this.clientData.sprites.push({
      x: x,
      y: y,
      sprite: sprite
    });
  }
  circle(x, y, width, height, color){
    this.clientData.circles.push({
      x: x,
      y: y,
      width: width,
      height: height,
      color: color
    });
  }
  sound(x, y, sound){
    this.clientData.sounds.push({
      x: x,
      y: y,
      sound: sound
    });
  }
  text(x, y, text, color, size){
    this.clientData.text.push({
      x: x,
      y: y,
      text: text,
      color: color,
      size: size
    });
  }
  Player = class{
    constructor(x,y,name){
      this.input = {x:0,y:0};
      this.name = name;
      this.image = 'idle'
      this.health = 100;
      this.x = x; 
      this.y = y;
      this.xv = 0; 
      this.yv = 0;
      this.speed = 4;
      this.falling = 0;
      this.size = 20;
      this.cooldown =0;
    }
    tick(game){
      this.yv += 1; this.falling += 1;// Apply gravity
      this.xv = this.input.x* this.speed; // Move the player left or right
      if ((this.input.y==1) && this.falling<3){ this.yv = -15} // Jump
      this.x += this.xv; this.y += this.yv; // Move the player  
      if(this.y>(360-this.size/2)){ // collision bottom of screen
        this.falling = 0; 
        this.y=(360-this.size/2) 
      }
      if(this.x<0){this.x+=1280}; if(this.x>1280){this.x-=1280}; //wrap 
      if(this.input.y ==-1){ this.attack()}  
      this.cooldown-=1;    
      game.circle(this.x,this.y,20,20,'#383838');
      game.text(this.x,this.y-20,this.name,'#383838',20);
    }
    async attack(){
      if (this.cooldown > 0) {return}
      this.image='attack'
      await new Promise(resolve => setTimeout(resolve, 200));
      this.image='idle'
      this.cooldown = 60;
      objects.push(new Projectile(this.x,this.y))
    }
    death(){ this.velX = 0; this.velY = 0;}
  }
  Projectile = class{
    constructor(x,y){
      this.image = 'idle' 
      this.x = x; this.y = y;
      this.xv = 0; this.yv = 0;
    }
    tick(game){
      game.draw(this.x,this.y,this.image);
    }
  }
}

var game = new Game(2,60);
io.on('connection',(player)=>{ game.join(player)});
app.use(express.static('game'));
server.listen(port,()=>{ console.log(`Server live ${port}.`)});
