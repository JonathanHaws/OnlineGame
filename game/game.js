let players = {};
let player;
function setup(){
  createCanvas(1280,720);
  let name = prompt("Please enter your name:");
  console.log(name);
  player = new Player(width/2, height/2, name);
  socket = io.connect();// connect to the server
  setInterval(() => { socket.emit('update',{x:player.x, y:player.y, name:player.name, health:player.health, sprite:player.sprite})},1000/60); 
  socket.on('update', function(data) {players = data;});
}
  
function draw(){ //console.log(players); //list of all players on server
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);

  for (let p in players){ 
    let player = players[p];
    fill('#3b3b3b80');
    textSize(20); textAlign(CENTER);
    text(player.name, player.x, player.y-20);
    fill(255, 0, 0);
    if (player.sprite == 'attack'){
      ellipse(player.x, player.y+5, 40, 10);
    } else {
      circle(player.x, player.y, 20);
    }
    rect(player.x - 25, player.y - 40, (player.health/100)*50, 5);
  }
  player.update();
}
  
class Player{
  constructor(x, y, name) {
    this.name = name;
    this.sprite = 'idle';
    this.health = 100;
    this.x = x; this.y = y;
    this.xv = 0; this.yv = 0;
    this.speed = 4;
    this.falling = 0;
    this.size = 20;
  }
  update(){
    let xinput = ((keyIsDown(68)||keyIsDown(RIGHT_ARROW))-(keyIsDown(65)||keyIsDown(LEFT_ARROW)))
    let yinput = (keyIsDown(87)||keyIsDown(UP_ARROW)||keyIsDown(32)-(keyIsDown(83)||keyIsDown(DOWN_ARROW)))
    this.yv += 1; this.falling += 1;// Apply gravity
    this.xv = xinput* this.speed; // Move the player left or right
    if ((yinput==1) && this.falling<3){ this.yv = -15} 
    this.x += this.xv; this.y += this.yv; // Move the player
    if(this.y > (height/2 - this.size/2)){ // collision bottom of screen
      this.falling = 0; 
      this.y = (height/2 - this.size/2) 
    }
    if(this.x<0){this.x+= width} if(this.x>width){this.x-= width}; //wrap 
    if(yinput ==-1){ this.attack()}      

  }
  async attack(){
    this.sprite='attack'
    await new Promise(resolve => setTimeout(resolve, 200));
    this.sprite='idle'
  }


  reset(){
    this.x = this.spawnx; this.y = this.spawny;
    this.velX = 0; this.velY = 0;
  }
}

