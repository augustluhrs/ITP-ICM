
var atmans = [];

function Atman(id, x, y, fud){
  this.id = id;
  this.x = x;
  this.y = y;
  this.fud = fud;
}

var express = require('express');
var app = express();
var server = app.listen(3000);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

//console.log('My socket server is running');
// var socket = require('socket.io');
// var io = socket(server);

var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat(){
  io.sockets.emit('heartbeat', atmans);
}

io.sockets.on('connection',
  function(socket){
    console.log("We have a new client: " + socket.id);
    socket.on('start',
      function(data){
        console.log(socket.id + " " + socket.fud);
        var atman = new Atman(socket.id, data.x, data.y, data.fud);
        atmans.push(atman);
      }
    );

    socket.on('update',
      function(data) {
        var atman;
        for (var i = 0; i < atmans.length; i++){
          if (socket.id == atmans[i].id){
            atman = atmans[i];
          }
        }
        atman.x = data.x;
        atman.y = data.y
        atman.fud = data.fud;
      }
    );

    socket.on('disconnect',
      function(){
        console.log("Client has disconnected");
      }
    );
  }
);
/*
function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('mouse', mouseMsg);

  function mouseMsg(data){
    socket.broadcast.emit('mouse', data);
    console.log(data);
  }
}
*/
