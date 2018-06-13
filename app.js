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
app.get('/leaflet.js', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/leaflet.js');
});
app.get('/leaflet.css', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/leaflet.css');
});

app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/assets/css/style.css');
});

app.get('/fontawesome-all.css', function (req, res) {
    res.sendFile(__dirname + '/lib/fontawesome/fontawesome-all.css');
});
app.get('/bg.jpg', function (req, res) {
    res.sendFile(__dirname + '/assets/img/bg.jpg');
});

app.get('/init.js', function (req, res) {
    res.sendFile(__dirname + '/dist/init.js');
});
app.get('/window.js', function (req, res) {
    res.sendFile(__dirname + '/dist/window.js');
});
app.get('/marker-icon-green.png', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/images/marker-icon-green.png');
});
app.get('/marker-icon-red.png', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/images/marker-icon-red.png');
});
app.get('/marker-icon.png', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/images/marker-icon.png');
});
app.get('/marker-icon-2x.png', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/images/marker-icon-2x.png');
});
app.get('/marker-shadow.png', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/images/marker-shadow.png');
});
app.get('/vanilla-notify.css', function (req, res) {
    res.sendFile(__dirname + '/lib/notify/vanilla-notify.css');
});
app.get('/vanilla-notify.js', function (req, res) {
    res.sendFile(__dirname + '/lib/notify/vanilla-notify.js');
});

var users = new warehouse.Warehouse();
var disconnected = [];
// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    var id = null;
    socket.on('new_user', function (data) {
        var keys = keypair(256);
        var user_data = JSON.parse(data);
        var elt = new auth.Auth(keys.public, keys.private, user_data.user_id);

        id = user_data.user_id;

        var allUsers = users.getUsers();

        if (allUsers.length > 0) {
            socket.emit('load_users', JSON.stringify(allUsers));
        }

        //user
        var user = {
            user_id: user_data.user_id,
            lat: user_data.lat,
            lng: user_data.lng,
            markerType: user_data.markerType
        }

        users.insert(user, elt.getPrivateKey(), elt.getPublicKey());
        socket.broadcast.emit('load_user', JSON.stringify(user));

        socket.emit('console',id);
    });

    socket.on('start_connect',function(data){
            socket.broadcast.emit('handshake',data);   
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
                socket.emit('console',false);

        }, 500);


    });

});



http.listen(3000, function () {
    console.log('listening on *:3000');
});