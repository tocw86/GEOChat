var Init = /** @class */ (function () {
    /**
     * Start
     *
     * @param socket Socket.io
     */
    function Init(socket, markerType, auth) {
        var _this = this;
        this.usersMarkers = [];
        this.icons = {
            red: L.icon({
                iconUrl: 'marker-icon-red.png',
                shadowUrl: 'marker-shadow.png',
            }),
            green: L.icon({
                iconUrl: 'marker-icon-green.png',
                shadowUrl: 'marker-shadow.png',
            }),
            blue: L.icon({
                iconUrl: 'marker-icon.png',
                shadowUrl: 'marker-shadow.png',
            }),
        };
        this.start = function () {
            _this.run(_this.map.getDefaultPosition());
        };
        /**
        * Run after get geo action
        */
        this.run = function (position) {
            _this.sendUserData();
            _this.auth = new _this.auth(_this.user.getUserId());
            _this.mapEvents();
            _this.setUserMarker();
            _this.windowEvents();
            _this.triggerSocketEvents();
        };
        /**
         * Send user data to socket
         * @return void
         */
        this.sendUserData = function () {
            _this.socket.emit('new_user', _this.user.getJsonFromUser());
        };
        /**
         * Factory for load users
         * @param lat
         * @param lng
         * @param user_id
         * @returns marker
         */
        this.markerFactory = function (lat, lng, user_id, markerType) {
            var self = _this;
            var icon = _this.icons[markerType];
            var marker = L.marker([lat, lng], { icon: icon }).addTo(_this.map.getMap()).on('click', function (event) {
                var $this = this;
                setTimeout(function () {
                    document.getElementById(user_id).addEventListener('click', function (e) {
                        self.startHandshake(user_id, $this);
                    });
                }, 50);
            });
            marker.bindPopup('<p>' + user_id + '<br/><button id="' + user_id + '">Handshake</button></p>');
            return marker;
        };
        /**
         * Begin handshake
         *
         * @param  {string} user_id
         * @param  {any} $this
         * @returns void
         */
        this.startHandshake = function (user_id, $this) {
            if (_this.user.isMoving()) {
                _this.communicator.setMyContext(_this);
                _this.communicator.setFriendContext($this);
                var friend_position = $this.getLatLng();
                var my_position = _this.user.getMarker().getLatLng();
                var distance = _this.calculateDistance(my_position.lat, friend_position.lat, my_position.lng, friend_position.lng);
                if (distance < 3000) {
                    //block moving
                    _this.user.stopMoving();
                    _this.communicator.setMyContext(_this);
                    _this.communicator.setFriendContext($this);
                    _this.communicator.setFriendId(user_id);
                    //comunicate to friend
                    _this.socket.emit('start_connect', JSON.stringify({ to: user_id, from: _this.user.getUserId(), gps: [[friend_position.lat, friend_position.lng], [my_position.lat, my_position.lng]], sender_pub_key: _this.auth.getPublicKey() }));
                }
                else {
                    alert("To far to make connection (" + distance + " m). Min. distance 3000m");
                }
            }
        };
        /**
         * Return distance
         * @param  {number} lat1
         * @param  {number} lat2
         * @param  {number} long1
         * @param  {number} long2
         */
        this.calculateDistance = function (lat1, lat2, long1, long2) {
            var p = 0.017453292519943295; // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
            var dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
            return Math.round(dis * 1000); //distance m
        };
        /**
         * Check if user is connect
         */
        this.isConnected = function () {
            if (_this.user.isConnected() && _this.socket.connected) {
                return true;
            }
            else if (_this.user.isConnected() && !_this.socket.connected) {
                _this.notify.makeNotify("error", "Disconnected please refresh page", "Error");
                _this.user.disconnect();
                _this.cleanAllMarkers();
                _this.map.disableMap();
                _this.disableUser();
                _this.changeStatusHtml();
                return false;
            }
            else if (!_this.user.isConnected() && !_this.socket.connected) {
                return false;
            }
        };
        /**
         * Trigger all socket events
         * @return void
         */
        this.triggerSocketEvents = function () {
            var self = _this;
            /**
             * Sender draw line
             */
            _this.socket.on('draw_line', function (flag) {
                if (flag) {
                    var friend_position = self.communicator.getFriendContext().getLatLng();
                    var my_position = self.user.getMarker().getLatLng();
                    self.sender_line = L.polyline([[friend_position.lat, friend_position.lng], [my_position.lat, my_position.lng]], {
                        color: 'red',
                        opacity: 1,
                        weight: 2
                    }).addTo(self.map.getMap());
                }
            });
            /**
             * Main decode
             */
            _this.socket.on('receive_message', function (data) {
                var connection_data = JSON.parse(data);
                if (connection_data.hasOwnProperty('to') && connection_data.hasOwnProperty('encrypted')) {
                    var message = self.auth.decrypt_received(connection_data.encrypted);
                    self.notify.makeNotify('success', message, 'New message');
                    alert(message);
                }
            });
            /**
             * Sender make line
             */
            _this.socket.on('make_line', function () {
                self.notify.makeNotify('info', 'Private Room', 'Connected to user');
                self.sender_line.setStyle({
                    color: 'green'
                });
                self.map.getMap().closePopup();
                self.addSendButton(function () {
                    var text = document.getElementById("chat_box").value;
                    var connection_data = { encrypted: "", to: "" };
                    connection_data.encrypted = self.auth.encrypt(text, self.communicator.getFriendPublicKey());
                    connection_data.to = self.communicator.getFriendId();
                    self.socket.emit('send_message', JSON.stringify(connection_data));
                });
            });
            _this.socket.on('save_friend_key', function (friend_pub_key) {
                self.communicator.setFriendPublicKey(friend_pub_key);
                console.log('Zapisano klucz publiczny odbiorcy');
            });
            /**
             * Sender make button disconnect
             */
            _this.socket.on('make_button_disconnect', function () {
                self.makeButtonDisconnect(function () {
                    //console.log(self);
                });
            });
            /**
             * Sender remove line
             */
            _this.socket.on('remove_line', function () {
                self.notify.makeNotify('error', 'Private Room', 'Friend refuse invitation');
                self.map.getMap().removeLayer(self.sender_line);
                self.user.setEnable();
                self.user.startMoving();
            });
            /**
             * Friend handshake
             */
            _this.socket.on('handshake', function (data) {
                var connection_data = JSON.parse(data);
                if (connection_data.to == self.user.getUserId() && self.user.isMoving()) {
                    self.user.stopMoving();
                    if (confirm('Handshake from:' + connection_data.from)) {
                        self.user.disable();
                        self.communicator.setFriendPublicKey(connection_data.sender_pub_key);
                        console.log('Zapisano klucz publiczny nadawcy');
                        connection_data.friend_pub_key = self.auth.getPublicKey();
                        self.socket.emit('handshake_success', JSON.stringify(connection_data));
                        self.receiver_line = L.polyline(connection_data.gps, {
                            color: 'green',
                            opacity: 1,
                            weight: 2
                        }).addTo(self.map.getMap());
                        self.notify.makeNotify('info', 'Private Room', 'Connected to user');
                        self.makeButtonDisconnect(function () {
                            // alert('odbiorca alert');
                        });
                        self.addSendButton(function () {
                            var text = document.getElementById("chat_box").value;
                            var _connection_data = { encrypted: self.auth.encrypt(text, self.communicator.getFriendPublicKey()), to: connection_data.from };
                            self.socket.emit('send_message', JSON.stringify(_connection_data));
                        });
                        return true;
                    }
                    else {
                        self.user.startMoving();
                        self.user.setEnable();
                        self.socket.emit('handshake_failed', data);
                        self.notify.makeNotify('error', 'Private Room', 'Refused invitation');
                        return false;
                    }
                }
            });
            /**
             * Load all users
             */
            _this.socket.on('load_users', function (usersData) {
                var data = JSON.parse(usersData);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].user_id != self.user.getUserId() && data[i].enabled) {
                        var marker = self.markerFactory(data[i].lat, data[i].lng, data[i].user_id, data[i].markerType);
                        self.usersMarkers.push({
                            user_id: data[i].user_id,
                            marker: marker,
                            enabled: data[i].enabled
                        });
                    }
                }
            });
            /**
            * Load logged in user
            */
            _this.socket.on('load_user', function (usersData) {
                var data = JSON.parse(usersData);
                if (data.user_id != self.user.getUserId()) {
                    var marker = self.markerFactory(data.lat, data.lng, data.user_id, data.markerType);
                    self.usersMarkers.push({
                        user_id: data.user_id,
                        marker: marker,
                        enabled: data.enabled
                    });
                }
            });
            /**
             * Event after user move marker
             */
            _this.socket.on('move_marker', function (usersData) {
                var data = JSON.parse(usersData);
                for (var i = 0; i < self.usersMarkers.length; i++) {
                    if (data.user_id == self.usersMarkers[i].user_id) {
                        self.usersMarkers[i].marker.setLatLng({
                            lat: data.lat,
                            lng: data.lng
                        });
                    }
                }
            });
            /**
             * Remove user marker
             */
            _this.socket.on('remove_marker', function (user_id) {
                for (var i = 0; i < self.usersMarkers.length; i++) {
                    if (user_id == self.usersMarkers[i].user_id) {
                        self.usersMarkers[i].marker.remove();
                    }
                }
            });
        };
        this.cleanAllMarkers = function () {
            for (var i = 0; i < _this.usersMarkers.length; i++) {
                _this.usersMarkers[i].marker.remove();
            }
            _this.user.getMarker().remove();
        };
        this.disableUser = function () {
            _this.user.disable();
            _this.user.stopMoving();
        };
        this.changeStatusHtml = function () {
            document.getElementById("status_toolbar").innerHTML = "  <i class=\"fas fa-ban danger\"></i>&nbsp;disconnected";
        };
        /**
         * Add send button
         * @param  {()=>void} callback
         * @returns void
         */
        this.addSendButton = function (callback) {
            var button = document.createElement('button');
            button.id = "send_button";
            button.style.width = "100px";
            button.style.height = "100px";
            button.innerHTML = "Send";
            document.getElementById("console").appendChild(button);
            button.addEventListener("click", function () {
                callback();
            });
        };
        /**
         * Set user marker
         * @return void
         */
        this.setUserMarker = function () {
            var item = _this.icons[_this.user.getMarkerType()];
            _this.user.setMarker(L.marker([_this.user.getLat(), _this.user.getLng()], { icon: item }).addTo(_this.map.getMap()));
        };
        /**
         * Trigger map events
         * @return void
         */
        this.mapEvents = function () {
            var self = _this;
            _this.map.getMap().on('click', function (event) {
                self.isConnected();
                if (typeof self.user.getMarker() != 'undefined' && self.user.isMoving() && self.isConnected()) {
                    self.user.setLat(event.latlng.lat);
                    self.user.setLng(event.latlng.lng);
                    self.user.getMarker().setLatLng(event.latlng);
                    self.updateUserData();
                }
            });
        };
        /**
         * Send update data to socket
         */
        this.updateUserData = function () {
            _this.socket.emit('update_user', _this.user.getJsonFromUser());
        };
        this.auth = auth;
        this.socket = socket;
        this.communicator = new Comunicator.Comunicator();
        this.notify = new Notify.Notify();
        this.map = new Map.Map();
        this.user = new User.User(this.socket.id, this.map.getDefaultPosition(), markerType);
    }
    /**
     * Trigger window events
     * @return void
     */
    Init.prototype.windowEvents = function () {
        var self = this;
        window.addEventListener('beforeunload', function (e) {
            //self.socket.emit('remove_user', self.user_id);
        });
    };
    /**
     * Add html button
     * @return void
     */
    Init.prototype.makeButtonDisconnect = function (callback) {
        var div = document.createElement('div');
        div.setAttribute("class", "d-b");
        var container = document.getElementById("console");
        container.appendChild(div);
        var button = document.createElement('button');
        button.innerHTML = "Disconnect";
        div.appendChild(button);
        button.addEventListener("click", function () {
            //callback();
            window.location.href = "/";
        });
    };
    return Init;
}());
