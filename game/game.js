let players = {};
let player;
function setup(){
  createCanvas(1280,720); //canvas.parent('#game');
  player = new Player(width/2, height/2);
  socket = io.connect();// connect to the server
  setInterval(() => { socket.emit('update',{x:player.x, y:player.y})},1000/60); 
  socket.on('update', function(data) {players = data;});
}
  
function draw(){
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);
  //console.log(players);
  for (let player in players){ fill(255, 0, 0); circle(players[player].x, players[player].y, 20);}
  player.update();
}
  
class Player{
  constructor(x, y) {
    this.x = x; this.y = y;
    this.velX = 0; this.velY = 0;
    this.falling = 0;
    this.size = 20;
  }
  update(){
    let xinput = ((keyIsDown(68)||keyIsDown(RIGHT_ARROW))-(keyIsDown(65)||keyIsDown(LEFT_ARROW)))
    let yinput = (keyIsDown(87)||keyIsDown(UP_ARROW)||keyIsDown(32))
    this.velY += 1; this.falling += 1;// Apply gravity
    this.velX = xinput*5; // Move the player left or right
    if (yinput && this.falling < 3) { this.velY = -15; } // Jump
    this.x += this.velX; this.y += this.velY; // Move the player
    if(this.y > (height/2 - this.size/2)){ // collision bottom of screen
      this.falling = 0; 
      this.y = (height/2 - this.size/2) 
    }
  }
  reset(){
    this.x = this.spawnx; this.y = this.spawny;
    this.velX = 0; this.velY = 0;
  }
}

