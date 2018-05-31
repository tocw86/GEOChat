var app = require('express')();
var http = require('http').Server(app);
var keypair = require('keypair');
var auth = require('./dist/auth');
var warehouse = require('./dist/warehouse');
var io = require('socket.io').listen(http);
io.set('origins', 'http://localhost:3000');


// Loading the index file . html displayed to the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/leaflet/leaflet.js', function (req, res) {
    res.sendFile(__dirname + '/leaflet/leaflet.js');
});
app.get('/leaflet/leaflet.css', function (req, res) {
    res.sendFile(__dirname + '/leaflet/leaflet.css');
});
app.get('/init.js', function (req, res) {
    res.sendFile(__dirname + '/dist/init.js');
});
app.get('/leaflet/images/marker-icon.png', function (req, res) {
    res.sendFile(__dirname + '/leaflet/images/marker-icon.png');
});
app.get('/leaflet/images/marker-icon-2x.png', function (req, res) {
    res.sendFile(__dirname + '/leaflet/images/marker-icon-2x.png');
});
app.get('/leaflet/images/marker-shadow.png', function (req, res) {
    res.sendFile(__dirname + '/leaflet/images/marker-shadow.png');
});

var users = new warehouse.Warehouse();
var disconnected = [];
// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    var id = null;
    socket.on('new_user', function (data) {
        var keys = keypair();
        var user_data = JSON.parse(data);
        var elt = new auth.Auth(keys.public, keys.private, user_data.user_id);

        id = user_data.user_id;

        var allUsers = users.getUsers();
        if (allUsers.length > 0) {
            socket.emit('load_users', JSON.stringify(allUsers));
        }

        users.insert({
            user_id: user_data.user_id,
            lat: user_data.lat,
            lng: user_data.lng,
        }, elt.getPrivateKey(), elt.getPublicKey());


        socket.broadcast.emit('load_user', JSON.stringify({
            user_id: user_data.user_id,
            lat: user_data.lat,
            lng: user_data.lng,
        }));

    });


    socket.on('update_user', function (userData) {
        users.updateData(JSON.parse(userData));
        socket.broadcast.emit('move_marker', userData);

    });
    socket.on('remove_user', function (userId) {
        console.log('Klient: ' + userId + ' opuscił czat!');
        users.removeUser(userId);
        socket.broadcast.emit('remove_marker', userId);
     });

    socket.on('disconnect', function () {

        setTimeout(function () {
 
                console.log('Disconnected: ' + id);
                users.removeUser(id);
                socket.broadcast.emit('remove_marker', id);
  

        }, 500);


    });

});



http.listen(3000, function () {
    console.log('listening on *:3000');
});