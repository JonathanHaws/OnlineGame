
var serverinfo;
function setup(){
  createCanvas(1280,720);
  let name = prompt("Please enter your name:");
  socket = io.connect('',{query:"name="+name});;// connect to the server
  setInterval(()=>{socket.emit('input',{ x:((keyIsDown(68)||keyIsDown(RIGHT_ARROW))-(keyIsDown(65)||keyIsDown(LEFT_ARROW))),y:(keyIsDown(87)||keyIsDown(UP_ARROW)||keyIsDown(32)-(keyIsDown(83)||keyIsDown(DOWN_ARROW)))})},1000/60); //
  socket.on('update',function(frame){serverinfo=frame;});
}
  
function draw(){// console.log(serverinfo);
  if(serverinfo){}
  background(220);
  fill(100);
  rect(0, height/2, width, height/2);
  if(serverinfo){
    serverinfo.sprites.forEach(sprite =>{
      circle(sprite.x, sprite.y, 20);
 
    })
   
  }

  
  // arr.forEach(obj => {
  //   console.log(obj.name + ' is ' + obj.age + ' years old');
  // });
  // for (let i in game.objects){let object=game.objects[i];
  //   fill('#3b3b3b80');
  //   textSize(20); textAlign(CENTER);
  //   text(object.name, object.x, object.y-20);
  //   fill(255, 0, 0);
  //   if (object.sprite == 'attack'){
  //     ellipse(object.x, object.y+5, 40, 10);
  //   } else {
  //     circle(object.x, object.y, 20);
  //   }
  //   rect(object.x - 25, object.y - 45, (object.health/100)*50, 5);
  // }
}
  