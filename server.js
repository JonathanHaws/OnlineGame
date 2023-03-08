
const express = require('express');
const app     = express();
const http    = require('http');
const server  = http.createServer(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3001;

class Game {
  constructor(maxPlayers, tickrate){
    this.join = function(player){
      if (Object.keys(this.players).length >= this.maxPlayers){
        console.log('Game Is Full');
        player.disconnect();
        return;
      }
      console.log(`Player ${player.id} Joined`);
      this.players[player.id] = new Player(this, 0, 0, player.handshake.query.name || 'player');
      player.on('input',(input)=>{ 
        this.players[player.id].input = input
      })    
      player.on('disconnect',()=>{ 
        console.log(`Player ${player.id} Left`);
        delete this.players[player.id];
      });
    }
    this.tick = function(){
      this.clientData = { sprites: [], sounds:[], text:[], circles:[], rectangles:[] };
      this.objects.forEach(object => object.tick());  
      Object.values(this.players).forEach(player => {player.tick();});
      Object.keys(this.players).forEach(player => {io.to(player).emit('tick', this.clientData);});
    }
    this.interval = setInterval(()=> this.tick(), 1000/tickrate); 
    this.maxPlayers = maxPlayers;
    this.players = {};
    this.objects = [];
    this.game = this;
    
    function despawn(object){
      game.objects.splice(game.objects.indexOf(object), 1);
    }
    function draw(x, y, sprite){
      game.clientData.sprites.push({
        x: x,
        y: y,
        sprite: sprite
      });
    }
    function circle(x, y, width, height, color){
      game.clientData.circles.push({
        x: x,
        y: y,
        width: width,
        height: height,
        color: color
      });
    }
    function sound(x, y, sound){
      game.clientData.sounds.push({
        x: x,
        y: y,
        sound: sound
      });
    }
    function text(x, y, text, color, size){
      game.clientData.text.push({
        x: x,
        y: y,
        text: text,
        color: color,
        size: size
      });
    }
    function rectangle(x, y, width, height, color){
      game.clientData.rectangles.push({
        x: x,
        y: y,
        width: width,
        height: height,
        color: color,
      });
    }
    function object(object, type, x, y, xv, yv, width, height, image){
      object.type = type;
      object.x = x;
      object.y = y;
      object.xv = xv;
      object.yv = yv;
      object.width = width;
      object.height = height;
      object.image = image;
    }
    function move(object, gravity, friction){
      object.yv += gravity; 
      object.xv *= friction;
      object.x += object.xv; 
      object.y += object.yv; 
    }
    function collide(){
  
    }
    function colidingwith(obj1, obj2){
      return (obj1.x + obj1.width > obj2.x &&
              obj1.x < obj2.x + obj2.width &&
              obj1.y + obj1.height > obj2.y &&
              obj1.y < obj2.y + obj2.height)
    }
    function pointTowardsFrom(p1x, p1y, p2x, p2y){
      let angle = Math.atan2(p2y-p1y, p2x-p1x);
      return {x: Math.cos(angle), y: Math.sin(angle)};
    }
    function wrap(object){
      if(object.x < 0){
        object.x += 1280
      }; 
      if(object.x > 1280){
        object.x -= 1280
      }     
    }

    class Player{
      constructor(game, x, y, name){
        object(this,'Player', 40, 40, x, y, 20, 20, 'idle'); 
        this.input = {x:0, y:0, mouseX:0, mousey:0, mouseIsPressed:0};
        this.name = name;
        this.death(0);
      }
      tick(){
        if (this.health <= 0) { this.death(200); return } //death
        move(this, 1, .7); 
        this.xv += this.input.x * this.speed; // Side Movement
        if (this.input.y == 1 && this.falling < 6) { this.yv = -12 } // Jumping
        if(this.y > 360){  // collision bottom of screen
          this.falling = 0; 
          this.y = 360;                           
        } else { this.falling += 1;}
        wrap(this);
        if(this.input.mouseIsPressed){ this.attack()}  
        this.cooldown-=1;    
        circle(this.x, this.y, 20, 20,'#383838');
        text(this.x, this.y-20, this.name,'#383838',20);
        rectangle(this.x -25, this.y-40, (this.health/100)*50, 5, '#383838');
        if(this.input.y == -1){ this.health --;}  
      }
      async attack(){
        if (this.cooldown > 0) {return}
        this.image='attack'
        await new Promise(resolve => setTimeout(resolve, 200));
        this.image='idle'
        this.cooldown = 0;
        var direction = pointTowardsFrom(this.x, this.y, this.input.mouseX, this.input.mouseY);
        game.objects.push(new Projectile(this.x, this.y, direction.x, direction.y,20));
      }
      async death(cooldown){ 
        this.x = (Math.floor(Math.random() * 5000));
        this.y = -40;
        this.xv = 0;
        this.yv = 0;
        this.health = 100;
        this.falling = 0;
        this.speed = 3;
        this.cooldown =0;
      }
    }
    class Projectile{
      constructor(x,y,xv,yv,power){
        object(this, 'Player', x, y, xv * power, yv * power, 20, 20, 'idle'); 
      }
      tick(){
        move(this, 1, 1); 
        wrap(this);
        circle(this.x,this.y,5,5,'#383838');
        if(this.y>400){ despawn(this)}
      }
    }
  }
}

var game = new Game(2,60);
io.on('connection',(player)=>{ game.join(player)});
app.use(express.static('game'));
server.listen(port,()=>{ console.log(`Server live ${port}.`)});
