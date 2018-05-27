var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var keypair = require('keypair');
var auth = require('./dist/auth');
var warehouse = require('./dist/warehouse');
var map = require('./dist/map');
 
var users = new warehouse.Warehouse();


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('send_position', function (export_json) {

    var keys = keypair();
    var position = JSON.parse(export_json);
    var elt = new auth.Auth(keys.public, keys.private, position.lat, position.lng, position.id);

    users.insert({
      id: elt.getId(),
      lat: elt.getLat(),
      lng: elt.getLng(),
    }, elt.getPrivateKey(), elt.getPublicKey());
 
    io.emit('set_user_id', elt.getId());
    io.emit('update_markers', JSON.stringify(users.getUsers()));

    return elt.getId();
  });
 

  socket.on('user_exit',function(id){
    users.removeUser(id);
  });

});

http.listen(3000, function () {
  console.log('listening on *:3000');
});