
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
    this.sprite = 'idle';
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
    frame.draw(this.x,this.y,this.sprite)
  }
  async attack(){
    if (this.cooldown > 0) {return}
    this.sprite='attack'
    await new Promise(resolve => setTimeout(resolve, 200));
    this.sprite='idle'
    this.cooldown = 60;
    game.objects.push(new Projectile(this.x,this.y))
  }
  death(){ this.velX = 0; this.velY = 0;}
}

class Projectile{
  constructor(x,y){
    this.sprite = 'idle' 
    this.x = x; this.y = y;
    this.xv = 0; this.yv = 0;
  }
  update(){}
}

class clientData{
  constructor(){ this.sprites=[]; this.sounds=[]; this.text=[]}
  reset(){ this.sprites=[]; this.sounds=[]; this.text=[]}
  draw(x,y,sprite){ this.sprites.push({x:x, y:y, sprite:sprite})}
  sound(x,y,sound){ this.sounds.push({x:x, y:y, sound:sound})}
  text(x,y,text){ this.text.push({x:x, y:y, text:text})}
}

app.use(express.static('game'));

var frame = new clientData();
var objects = new Array(8).fill('available slot'); //first slots are players and length is max players 
setInterval(tick,1000/60); 
function tick(){ 
  frame.reset();
  objects.forEach(object => { if (object.update !== undefined){ object.update()}});
  //console.log(frame);
  io.emit('update', frame);//send out frame data to clients
} 

io.on('connection',(socket)=>{ //handle player joining server                
  if (!objects.includes('available slot')){ socket.disconnect(); return;} //server full
  console.log(`Player ${socket.id} Joined`);
  const slot = objects.indexOf('available slot');
  objects[slot] = new Player(0,0,socket.handshake.query.name); //console.log(game);
  socket.on('input',(input)=>{ objects[slot].input = input})
  socket.on('disconnect',()=>{ console.log(`Player ${socket.id} Left`); objects[slot]='available slot';});
})
server.listen(port,()=>{ console.log(`Server listening ${port}.`)});


