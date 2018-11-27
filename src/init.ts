class Init {
    private auth: any;
    private map: Map.Map;
    private user: User.User;
    private socket: any;
    private marker: any;
    private usersMarkers: Array<any> = [];
    private icons: any = {
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
    private sender_line: L.Polyline<GeoJSON.LineString | GeoJSON.MultiLineString, any>;
    private receiver_line: L.Polyline<GeoJSON.LineString | GeoJSON.MultiLineString, any>;
    private communicator: Comunicator.Comunicator;
    private notify: Notify.Notify;



    /**
     * Start
     * 
     * @param socket Socket.io
     */
    constructor(socket: any, markerType: string, auth: any) {
        this.auth = auth;
        this.socket = socket;
        this.communicator = new Comunicator.Comunicator();
        this.notify = new Notify.Notify();
        this.map = new Map.Map();
        this.user = new User.User(this.socket.id, this.map.getDefaultPosition(), markerType);
    }

    public start = () => {
        this.run(this.map.getDefaultPosition());
    }

    /**
    * Run after get geo action
    */
    public run = (position: any) => {


        this.sendUserData();

        this.auth = new this.auth(this.user.getUserId());

        this.mapEvents();

        this.setUserMarker();

        this.windowEvents();

        this.triggerSocketEvents();
    }

    /**
     * Trigger window events
     * @return void
     */
    private windowEvents(): void {
        var self = this;
        window.addEventListener('beforeunload', function (e) {
            //self.socket.emit('remove_user', self.user_id);
        });

    }



    /**
     * Send user data to socket
     * @return void
     */
    private sendUserData = (): void => {
        this.socket.emit('new_user', this.user.getJsonFromUser());
    }

    /**
     * Factory for load users
     * @param lat 
     * @param lng 
     * @param user_id 
     * @returns marker
     */

    private markerFactory = (lat: number, lng: number, user_id: string, markerType: string): any => {
        var self = this;
        var icon = this.icons[markerType];
        var marker = L.marker([lat, lng], { icon: icon }).addTo(this.map.getMap()).on('click', function (event: any) {

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
    private startHandshake = (user_id: string, $this: any): void => {

        if (this.moving) {

            this.communicator.setMyContext(this);
            this.communicator.setFriendContext($this);

            var friend_position = $this.getLatLng();
            var my_position = this.marker.getLatLng();

            var distance = this.calculateDistance(my_position.lat, friend_position.lat, my_position.lng, friend_position.lng);

            if (distance < 3000) {

                //block moving
                this.moving = false;
                this.communicator.setMyContext(this);
                this.communicator.setFriendContext($this);
                this.communicator.setFriendId(user_id);
                //comunicate to friend
                this.socket.emit('start_connect', JSON.stringify({ to: user_id, from: this.user_id, gps: [[friend_position.lat, friend_position.lng], [my_position.lat, my_position.lng]], sender_pub_key: this.auth.getPublicKey() }));

            } else {
                alert("To far to make connection (" + distance + " m). Min. distance 3000m");
            }


        }
    }

    /**
     * Return distance 
     * @param  {number} lat1
     * @param  {number} lat2
     * @param  {number} long1
     * @param  {number} long2
     */
    private calculateDistance = (lat1: number, lat2: number, long1: number, long2: number) => {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
        let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
        return Math.round(dis * 1000); //distance m
    }

    /**
     * Check if user is connect
     */
    private isConnected = (): boolean => {
        if (this.connected && this.socket.connected) {
            return true;
        } else if (this.connected && !this.socket.connected) {
            this.notify.makeNotify("error", "Disconnected please refresh page", "Error");
            this.connected = false;
            this.cleanAllMarkers();
            this.map.disableMap();
            this.disableUser();
            this.changeStatusHtml();
            return false;
        } else if (!this.connected && !this.socket.connected) {
            return false;
        }

    }

    /**
     * Add html button
     * @return void
     */
    private makeButtonDisconnect(callback: () => void): void {
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
    }

    /**
     * Trigger all socket events
     * @return void
     */
    private triggerSocketEvents = (): void => {
        var self = this;

        /**
         * Sender draw line
         */
        this.socket.on('draw_line', function (flag: boolean) {

            if (flag) {

                var friend_position = self.communicator.getFriendContext().getLatLng();
                var my_position = self.marker.getLatLng();

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
        this.socket.on('receive_message', function (data: string) {
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
        this.socket.on('make_line', function () {

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

        this.socket.on('save_friend_key', function (friend_pub_key: string) {
            self.communicator.setFriendPublicKey(friend_pub_key);
            console.log('Zapisano klucz publiczny odbiorcy');
        });

        /**
         * Sender make button disconnect
         */
        this.socket.on('make_button_disconnect', function () {
            self.makeButtonDisconnect(function () {
                //console.log(self);
            });
        });

        /**
         * Sender remove line
         */
        this.socket.on('remove_line', function () {
            self.notify.makeNotify('error', 'Private Room', 'Friend refuse invitation');
            self.map.getMap().removeLayer(self.sender_line);
            self.enabled = true;
            self.moving = true;
        });

        /**
         * Friend handshake
         */
        this.socket.on('handshake', function (data: string) {
            var connection_data = JSON.parse(data);
            if (connection_data.to == self.user_id && self.moving) {
                self.moving = false;

                if (confirm('Handshake from:' + connection_data.from)) {
                    self.enabled = false;
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
                } else {
                    self.moving = true;
                    self.enabled = true;
                    self.socket.emit('handshake_failed', data);
                    self.notify.makeNotify('error', 'Private Room', 'Refused invitation');
                    return false;
                }
            }

        });

        /**
         * Load all users
         */
        this.socket.on('load_users', function (usersData: string) {
            var data = JSON.parse(usersData);

            for (var i = 0; i < data.length; i++) {
                if (data[i].user_id != self.user_id && data[i].enabled) {
                    var marker = self.markerFactory(data[i].lat, data[i].lng, data[i].user_id, data[i].markerType);
                    self.usersMarkers.push(
                        {
                            user_id: data[i].user_id,
                            marker: marker,
                            enabled: data[i].enabled
                        }
                    );
                }

            }
        });

        /**
        * Load logged in user
        */
        this.socket.on('load_user', function (usersData: string) {
            var data = JSON.parse(usersData);

            if (data.user_id != self.user_id) {

                var marker = self.markerFactory(data.lat, data.lng, data.user_id, data.markerType);

                self.usersMarkers.push(
                    {
                        user_id: data.user_id,
                        marker: marker,
                        enabled: data.enabled
                    }
                );
            }
        });

        /**
         * Event after user move marker
         */
        this.socket.on('move_marker', function (usersData: string) {
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
        this.socket.on('remove_marker', function (user_id: string) {
            for (var i = 0; i < self.usersMarkers.length; i++) {
                if (user_id == self.usersMarkers[i].user_id) {
                    self.usersMarkers[i].marker.remove();
                }

            }
        });

    }

    private cleanAllMarkers = (): void => {
        for (var i = 0; i < this.usersMarkers.length; i++) {
            this.usersMarkers[i].marker.remove();
        }
        this.marker.remove();

    }

    private disableUser = (): void => {
        this.enabled = false;
        this.moving = false;
    }


    private changeStatusHtml = (): void => {
        document.getElementById("status_toolbar").innerHTML = "  <i class=\"fas fa-ban danger\"></i>&nbsp;disconnected";
    }

    /**
     * Add send button
     * @param  {()=>void} callback
     * @returns void
     */
    private addSendButton = (callback: () => void): void => {
        var button = document.createElement('button');
        button.id = "send_button";
        button.style.width = "100px";
        button.style.height = "100px";
        button.innerHTML = "Send"
        document.getElementById("console").appendChild(button);
        button.addEventListener("click", function () {
            callback();
        });
    }

    /**
     * Set user marker
     * @return void
     */
    private setUserMarker = (): void => {
        var item = this.icons[this.markerType];
        this.marker = L.marker([this.lat, this.lng], { icon: item }).addTo(this.map.getMap());
    }


    /**
     * Trigger map events
     * @return void
     */
    private mapEvents = (): void => {
        var self = this;
        this.map.getMap().on('click', function (event: any) {

            self.isConnected();

            if (typeof self.marker != 'undefined' && self.moving && self.isConnected()) {
                self.lat = event.latlng.lat;
                self.lng = event.latlng.lng;

                self.marker.setLatLng(event.latlng);
                self.updateUserData();

            }
        });

    }

    /**
     * Send update data to socket
     */
    private updateUserData = () => {
        this.socket.emit('update_user', this.getJsonFromUser());
    }

}
