
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
    })},1000/60); 
  socket.on('tick',function(frame){serverinfo=frame;});
}
  
function draw(){// console.log(serverinfo);
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);
  if(serverinfo){
    serverinfo.text.forEach(i =>     { fill(i.color); textSize(i.size); textAlign(CENTER); text(i.text, i.x, i.y)})
    serverinfo.circles.forEach(i =>  { fill(i.color); ellipse(i.x, i.y, i.width, i.height)})
    serverinfo.rectangles.forEach(i =>{ fill(i.color); rect(i.x, i.y, i.width, i.height)})
  }
}
  