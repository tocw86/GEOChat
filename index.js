
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var user_positions = [];
var keypair = require('keypair');
var auth = require('./dist/Auth');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('send_position', function(export_json){

        var keys = keypair();

        console.log(keys);

        
        user_positions.push(JSON.parse(export_json));
        io.emit('update_markers',JSON.stringify(user_positions));
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

