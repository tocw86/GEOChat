var Init = /** @class */ (function () {
    /**
     * Start
     *
     * @param socket Socket.io
     */
    function Init(socket) {
        var _this = this;
        this.token = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ';
        this.usersMarkers = [];
        /**
         * Set user safe data
         * @return void
         */
        this.setUserDate = function (position) {
            _this.lat = position.coords.latitude;
            _this.lng = position.coords.longitude;
            _this.user_id = Math.random().toString(36).substring(7);
        };
        /**
         * Get user data in json format
         * @return string
         */
        this.getJsonFromUser = function () {
            return JSON.stringify({
                lat: _this.lat,
                lng: _this.lng,
                user_id: _this.user_id
            });
        };
        /**
         * Send user data to socket
         * @return void
         */
        this.sendUserData = function () {
            _this.socket.emit('new_user', _this.getJsonFromUser());
        };
        /**
         * Trigger all socket events
         * @return void
         */
        this.triggerSocketEvents = function () {
            var self = _this;
            _this.socket.on('load_users', function (usersData) {
                var data = JSON.parse(usersData);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].user_id != this.user_id) {
                        var marker = L.marker([data[i].lat, data[i].lng]).addTo(self.map);
                        self.usersMarkers.push({
                            user_id: data[i].user_id,
                            marker: marker
                        });
                    }
                }
            });
            _this.socket.on('load_user', function (usersData) {
                var data = JSON.parse(usersData);
                if (data.user_id != this.user_id) {
                    var marker = L.marker([data.lat, data.lng]).addTo(self.map);
                    self.usersMarkers.push({
                        user_id: data.user_id,
                        marker: marker
                    });
                }
            });
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
            _this.socket.on('remove_marker', function (user_id) {
                for (var i = 0; i < self.usersMarkers.length; i++) {
                    if (user_id == self.usersMarkers[i].user_id) {
                        self.usersMarkers[i].marker.remove();
                    }
                }
            });
        };
        /**
         * Init map
         */
        this.initMap = function () {
            _this.map = L.map('map').setView([_this.lat, _this.lng], 18);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + _this.token, {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: _this.token
            }).addTo(_this.map);
        };
        /**
         * Set user marker
         * @return void
         */
        this.setUserMarker = function () {
            _this.marker = L.marker([_this.lat, _this.lng]).addTo(_this.map);
        };
        /**
         * Trigger map events
         * @return void
         */
        this.mapEvents = function () {
            var self = _this;
            _this.map.on('click', function (event) {
                if (typeof self.marker != 'undefined') {
                    self.lat = event.latlng.lat;
                    self.lng = event.latlng.lng;
                    self.marker.setLatLng(event.latlng);
                    self.updateUserData();
                }
            });
        };
        /**
         * Send update data to socket
         */
        this.updateUserData = function () {
            _this.socket.emit('update_user', _this.getJsonFromUser());
        };
        /**
         * Run after get geo action
         */
        this.run = function (position) {
            _this.setUserDate(position);
            _this.sendUserData();
            // this.windowEvents();
            _this.initMap();
            _this.setUserMarker();
            _this.mapEvents();
            _this.triggerSocketEvents();
        };
        this.socket = socket;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.run);
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    /**
     * Trigger window events
     * @return void
     */
    Init.prototype.windowEvents = function () {
        var self = this;
        window.onunload = function () {
            self.socket.emit('remove_user', self.user_id);
        };
    };
    return Init;
}());
