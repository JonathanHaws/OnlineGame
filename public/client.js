
async function loadSounds(sounds) {
  const audio = {};
  for (const sound of sounds) {
    audio[sound] = await new Audio(sound);
  }
  return audio;
}
loadSounds(['sounds/thud.mp3']);

let socket;
let serverinfo;
function setup() { 
  createCanvas(1280,720);
  socket = io.connect(); 
  let playerName = prompt("Please enter your name:");
  socket.emit('join',{ name : playerName, game : 1});
  socket.on('tick',function(frame){serverinfo=frame;});
  setInterval( ()=> { socket.emit('input',{ 
    x:((keyIsDown(68)||keyIsDown(RIGHT_ARROW))-(keyIsDown(65)||keyIsDown(LEFT_ARROW))),
    y:(keyIsDown(87)||keyIsDown(UP_ARROW)||keyIsDown(32)-(keyIsDown(83)||keyIsDown(DOWN_ARROW))),
    mouseX:mouseX,
    mouseY:mouseY,
    mouseIsPressed:mouseIsPressed
  })},1000/60); 
}

function draw(){ 
  if (serverinfo === undefined) { return; } //console.log(serverinfo);
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);
  Object.values(serverinfo.Players).forEach(i => { //console.log(i);
    fill('#7dc4c9'); 
    ellipse(i.x, i.y, i.width, i.height);
    textAlign(CENTER); 
    textSize(30); 
    fill('#303030');
    text(i.name, i.x, i.y - 30);
  });
  if(!serverinfo.Projectiles){ return; }
  Object.values(serverinfo.Projectiles).forEach(i => { //console.log(i);
    fill('#303030'); ellipse(i.x, i.y, i.width, i.height);
  });
}
  