
const express = require('express');
const app     = express();
const http    = require('http');
const server  = http.createServer(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3001;
app.use(express.static('game'));

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
  }
  async attack(){
    this.sprite='attack'
    await new Promise(resolve => setTimeout(resolve, 200));
    this.sprite='idle'
  }
  death(){ this.velX = 0; this.velY = 0;}
}

var game = {players:{},objects:{}} // holds all the data that needs to be sync between clients
function tick(){ 
  for (let i in game.players){ game.players[i].update();}
  io.emit('update', game);//send every client the game data
} 
setInterval(tick,1000/60); //tickrate
io.on('connection',(socket)=>{ //handle player joining server                
  if (Object.keys(game.players).length >= 4){ socket.disconnect(); return;} //server full
  console.log(`New Player ${socket.id}`);
  game.players[socket.id] = new Player(0,0,socket.handshake.query.name); //console.log(game);
  socket.on('input',(input)=>{ game.players[socket.id].input = input})
  socket.on('disconnect',()=>{ console.log(`Player Left ${socket.id}`); delete game.players[socket.id];});
})

server.listen(port,()=>{ console.log(`Server listening ${port}.`)});
