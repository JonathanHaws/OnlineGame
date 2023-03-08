
var serverinfo;
function setup(){
  createCanvas(1280,720);
  let name = prompt("Please enter your name:");
  socket = io.connect('',{query:"name="+name});;// connect to the server
  setInterval(()=>{
    socket.emit('input',{ 
      x:((keyIsDown(68)||keyIsDown(RIGHT_ARROW))-(keyIsDown(65)||keyIsDown(LEFT_ARROW))),
      y:(keyIsDown(87)||keyIsDown(UP_ARROW)||keyIsDown(32)-(keyIsDown(83)||keyIsDown(DOWN_ARROW))),
      mouseX:mouseX,
      mouseY:mouseY,
      mouseIsPressed:mouseIsPressed
    })},1000/60); //
  socket.on('tick',function(frame){serverinfo=frame;});
}
  
function draw(){// console.log(serverinfo);
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);
  if(serverinfo){
    serverinfo.circles.forEach(circle =>{ fill(circle.color); ellipse(circle.x, circle.y, circle.width, circle.height)})
    serverinfo.text.forEach(t =>{ fill(t.color); textSize(t.size); textAlign(CENTER); text(t.text, t.x, t.y)})
  }
}
  