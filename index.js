
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var user_positions = [];
var keypair = require('keypair');
var user = require('./dist/Auth');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('send_position', function(export_json){

        var keys = keypair();
        var position = JSON.parse(export_json);
        var elt = user.Auth(keys.public, keys.private,position.lat, position.lng);
        
        user_positions.push({
          id:elt.getId(),
          lat:elt.getLat(),
          lng:elt.getLng(),
        });
        
        io.emit('update_markers',JSON.stringify(user_positions));
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

