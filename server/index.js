
const express = require('express');
const app     = express();
const http    = require('http');
const server  = http.createServer(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3001;
const Game    = require('./modules/game.js');
const Player  = require('./modules/player.js');

let game = new Game(60,10);

io.on('connection',(socket)=>{ //console.log('Socket joined '+ socket.id);
  let player;
  socket.on('disconnect',()=>{ console.log('Socket left '+ socket.id);
    if(player){ game.despawn(player); } 
    socket.disconnect();
  });

  socket.on('join',(data)=>{ 
    if(game.connectedPlayers >= game.maxPlayers){ socket.emit('full'); return;}
    player = game.spawn(new Player(data.name)); //console.log(game);
    setInterval(()=>{ socket.emit('tick', game.serialized());}, 1000/game.tickRate);
    socket.on('input',(input)=>{ player.input = input; });
  });

});

app.use(express.static('client'));
server.listen(port,()=>{ console.log(`Server live ${port}.`)});
