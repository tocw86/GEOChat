var app = require('express')();
var http = require('http').Server(app);
var keypair = require('keypair');
var warehouse = require('./dist/warehouse');
var io = require('socket.io').listen(http);
//['http://geochat.pl:3000'], ['https://geochat.pl:3000']);
io.origins(['*:*']);

//TODO
//Trzeba wykrywać ssl i jeśli jest odpalać usługę lokalizacji a jak nie to tradycyjnie

// Loading the index file . html displayed to the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/leaflet.js', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/leaflet.js');
});
app.get('/leaflet.geometryutil.js', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/leaflet.geometryutil.js');
});
app.get('/leaflet.css', function (req, res) {
    res.sendFile(__dirname + '/lib/leaflet/leaflet.css');
});
app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/assets/css/style.css');
});

app.get('/core.min.js', function (req, res) {
    res.sendFile(__dirname + '/dist/core.min.js');
});

app.get('/logo.svg', function (req, res) {
    res.sendFile(__dirname + '/assets/img/logo.svg');
});

app.get('/blue-marker.svg', function (req, res) {
    res.sendFile(__dirname + '/assets/img/blue-marker.svg');
});

app.get('/green-marker.svg', function (req, res) {
    res.sendFile(__dirname + '/assets/img/green-marker.svg');
});

app.get('/red-marker.svg', function (req, res) {
    res.sendFile(__dirname + '/assets/img/red-marker.svg');
});


app.get('/yellow-marker.svg', function (req, res) {
    res.sendFile(__dirname + '/assets/img/yellow-marker.svg');
});

app.get('/bundle.js', function (req, res) {
    res.sendFile(__dirname + '/dist/bundle.js');
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
// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    var id = null;
    socket.on('new_user', function (data) {
        var user_data = JSON.parse(data);
        //przenieść do window
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
            markerType: user_data.markerType,
            enabled: true
        }

        users.insert(user);
        socket.broadcast.emit('load_user', JSON.stringify(user));

        socket.emit('console', id);
    });

    socket.on('start_connect', function (data) {
        if (users.isJson(data)) {
            var connection_data = JSON.parse(data);
            if (connection_data.hasOwnProperty('to') && connection_data.hasOwnProperty('from') && users.checkAvaible(connection_data.to)) {
                socket.emit('draw_line', true);
                socket.to(connection_data.to).emit('handshake', data);
            } else {
                socket.to(connection_data.from).emit('draw_line', false);
            }

        }

    });
    socket.on('handshake_success', function (data) {
        if (users.isJson(data)) {
            var connection_data = JSON.parse(data);
            if (connection_data.hasOwnProperty('to') && connection_data.hasOwnProperty('from')) {
                users.disable(connection_data.to);
                users.disable(connection_data.from);
                socket.to(connection_data.from).emit('save_friend_key', connection_data.friend_pub_key);
                socket.to(connection_data.from).emit('make_line');
                socket.to(connection_data.to).emit('make_button_disconnect');
                socket.to(connection_data.from).emit('make_button_disconnect');
            }

        }
    });

    socket.on('send_message', function (data) {
        if (users.isJson(data)) {
            var connection_data = JSON.parse(data);
            if (connection_data.hasOwnProperty('to') && connection_data.hasOwnProperty('encrypted')) {
                socket.to(connection_data.to).emit('receive_message', data);
            }
        }

    });

    socket.on('handshake_failed', function (data) {
        if (users.isJson(data)) {
            var connection_data = JSON.parse(data);
            users.enable(connection_data.to);
            users.enable(connection_data.from);
            socket.to(connection_data.from).emit('remove_line');
        }


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