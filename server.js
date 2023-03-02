
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

app.use(express.static('game'));

const players = {};
io.on('connection',(socket)=>{                      
  if (Object.keys(players).length >= 4) { 
    console.log('Server Full');
    socket.emit('Server Full (Max 4 Players)');
    socket.disconnect();
    return;
  } else { console.log(`New player connected: ${socket.id}`);}

  players[socket.id] = {x:0, y:0, name:""};
  socket.on('update',(data)=>{
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    players[socket.id].name = data.name;
    io.emit('update', players);
  });
  socket.on('disconnect',()=>{ console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('update', players);
  });
})
   
server.listen(port,()=>{ console.log(`Server is running on port ${port}.`)});
