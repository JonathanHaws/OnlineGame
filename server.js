
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

app.use(express.static('game'));

// var game = {players:{},objects:{}} // holds all the data that needs to be sync between clients
// function tick(){ io.emit('update', game);} //send every client the game data
// setInterval(tick,1000/30); //tickrate is 30

var players = {};
io.on('connection',(socket)=>{                      
  if (Object.keys(players).length >= 4) { 
    console.log('Server Full');
    socket.emit('Server Full (Max 4 Players)');
    socket.disconnect();
    return;
  } else { console.log(`New player connected: ${socket.id}`);}

  players[socket.id] = {x:0, y:0, name:"", health:100, sprite:"idle" };
  socket.on('update',(data)=>{
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    players[socket.id].name = data.name;
    players[socket.id].health = data.health;
    players[socket.id].sprite = data.sprite;
    io.emit('update', players);
  });
  socket.on('disconnect',()=>{ console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('update', players);
  });
})

   
server.listen(port,()=>{ console.log(`Server is running on port ${port}.`)});
