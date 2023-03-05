
const express = require('express');
const app     = express();
const http    = require('http');
const server  = http.createServer(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3001;

class Player{
  constructor(x,y,name){
    this.input = {x:0,y:0};
    this.name = name;
    this.image = 'idle'
    this.health = 100;
    this.x = x; this.y = y;
    this.xv = 0; this.yv = 0;
    this.speed = 4;
    this.falling = 0;
    this.size = 20;
    this.cooldown =0;
  }
  update(){ //console.log(xinput);
    this.yv += 1; this.falling += 1;// Apply gravity
    this.xv = this.input.x* this.speed; // Move the player left or right
    if ((this.input.y==1) && this.falling<3){ this.yv = -15} 
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

class Projectile{
  constructor(x,y){
    this.image = 'idle' 
    this.x = x; this.y = y;
    this.xv = 0; this.yv = 0;
  }
  update(){
    game.draw(this.x,this.y,this.image);
  }
}

var game = { 
  players:{},
  objects:[],
  clientData:{ empty(){this.sprites=[],this.sounds=[],this.text=[],this.circles=[]}},
  draw(x,y,sprite){ this.clientData.sprites.push({x:x,y:y,sprite:sprite})},
  circle(x,y,width,height,color){ this.clientData.circles.push({x:x,y:y,width:width,height:height,color:color})},
  sound(x,y,sound){ this.clientData.sounds.push({x:x,y:y,sound:sound})},
  text(x,y,text,color,size){ this.clientData.text.push({x:x,y:y,text:text,color:color,size:size})}
}

function tick(){ 
  game.clientData.empty();
  Object.values(game.players).forEach(player => player.update());
  game.objects.forEach(object => object.update());
  io.emit('update', game.clientData);
} 
setInterval(tick,1000/60); 

io.on('connection',(socket)=>{             
  if (Object.keys(game.players).length > 8){ socket.disconnect(); return;}
  game.players[socket.id] = new Player(0,0,socket.handshake.query.name); 
  socket.on('input',(input)=>{ game.players[socket.id].input = input}) 
  socket.on('disconnect',()=>{ delete game.players[socket.id];});
})

app.use(express.static('game'));
server.listen(port,()=>{ console.log(`Server live ${port}.`)});


