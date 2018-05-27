
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var user_positions = [];
var keypair = require('keypair');
var test = require('./dist/Main');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('send_position', function(export_json){
        test.makeUser();
        user_positions.push(JSON.parse(export_json));
        io.emit('update_markers',JSON.stringify(user_positions));
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

