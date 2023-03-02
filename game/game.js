
let game = {};
function setup(){
  createCanvas(1280,720);
  let name = prompt("Please enter your name:");
  socket = io.connect('',{query:"name="+name});;// connect to the server
  setInterval(()=>{socket.emit('input',{ 
    x:((keyIsDown(68)||keyIsDown(RIGHT_ARROW))-(keyIsDown(65)||keyIsDown(LEFT_ARROW))),
    y:(keyIsDown(87)||keyIsDown(UP_ARROW)||keyIsDown(32)-(keyIsDown(83)||keyIsDown(DOWN_ARROW)))})},
    1000/60); //
  socket.on('update',function(data){game=data;});
}
  
function draw(){ //console.log(game); //all game data from server
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);
  for (let i in game.players){let player=game.players[i];
    fill('#3b3b3b80');
    textSize(20); textAlign(CENTER);
    text(player.name, player.x, player.y-20);
    fill(255, 0, 0);
    if (player.sprite == 'attack'){
      ellipse(player.x, player.y+5, 40, 10);
    } else {
      circle(player.x, player.y, 20);
    }
    rect(player.x - 25, player.y - 45, (player.health/100)*50, 5);
  }
}
  