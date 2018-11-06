declare var vNotify: any;
class Init {
    private moving: boolean = true;
    private token: string = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ';
    private lat: number;
    private lng: number;
    private user_id: string;
    private map: any;
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
    private defaultPosition = {
        coords: {
            // latitude: 51.1739726374,
            // longitude: -1.82237671048
            latitude: 37.629562,
            longitude: -116.849556
        }
    };
    private markerType: string;
    private enabled: boolean = true;
    private sender_line: L.Polyline<GeoJSON.LineString | GeoJSON.MultiLineString, any>;
    private receiver_line: L.Polyline<GeoJSON.LineString | GeoJSON.MultiLineString, any>;
    private communicator: any = {

    }
    private connected: boolean = true;


    /**
     * Start
     * 
     * @param socket Socket.io
     */
    constructor(socket: any, markerType: string) {

        this.socket = socket;
        this.markerType = markerType;
        this.run(this.defaultPosition);

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(this.run, this.error);
        // } else {
        //     alert("Geolocation is not supported by this browser.");
        // }
    }

    public error = () => {
        this.run(this.defaultPosition);
    }

    /**
    * Run after get geo action
    */
    public run = (position: any) => {

        this.setUserDate(position)

        this.sendUserData();

        this.windowEvents();

        this.initMap();

        this.setUserMarker();

        this.mapEvents();

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
     * get random string
     * 
     * @param len 
     * @param charSet 
     */
    private randomString(len: number, charSet?: string): string {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    /**
     * Set user safe data
     * @return void
     */
    private setUserDate = (position: any): void => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.user_id = this.socket.id;
        this.enabled = true;
    }

    /**
     * Get user data in json format
     * @return string
     */
    private getJsonFromUser = (): string => {
        return JSON.stringify({
            lat: this.lat,
            lng: this.lng,
            user_id: this.user_id,
            markerType: this.markerType,
            enabled: this.enabled
        });
    }

    /**
     * Send user data to socket
     * @return void
     */
    private sendUserData = (): void => {
        this.socket.emit('new_user', this.getJsonFromUser());
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
        var marker = L.marker([lat, lng], { icon: icon }).addTo(this.map).on('click', function (event: any) {

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

            this.communicator.me = this;
            this.communicator.friend = $this

            var friend_position = $this.getLatLng();
            var my_position = this.marker.getLatLng();

            var distance = this.calculateDistance(my_position.lat, friend_position.lat, my_position.lng, friend_position.lng);

            if (distance < 3000) {

                //block moving
                this.moving = false;
                this.communicator.me = this;
                this.communicator.friend = $this;

                //comunicate to friend
                this.socket.emit('start_connect', JSON.stringify({ to: user_id, from: this.user_id, gps: [[friend_position.lat, friend_position.lng], [my_position.lat, my_position.lng]] }));

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
            this.notify("error", "Disconnected please refresh page", "Error");
            this.connected = false;
            this.cleanAllMarkers();
            this.disableMap();
            this.disableUser();
            this.changeStatusHtml();
            return false;
        } else if (!this.connected && !this.socket.connected) {
            return false;
        }

    }

    /**
     * 
     * Make notify
     * 
     * @param  {string} type
     * @param  {string} text
     * @param  {string} title
     * @returns void
     */
    private notify(type: string, text: string, title: string): void {
        vNotify[type]({
            text: text,
            title: title,
            sticky: true
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

                var friend_position = self.communicator.friend.getLatLng();
                var my_position = self.marker.getLatLng();

                self.sender_line = L.polyline([[friend_position.lat, friend_position.lng], [my_position.lat, my_position.lng]], {
                    color: 'red',
                    opacity: 1,
                    weight: 2
                }).addTo(self.map);

            }

        });
        /**
         * Sender make line
         */
        this.socket.on('make_line', function () {
            self.notify('info', 'Private Room', 'Connected to user');
            self.sender_line.setStyle({
                color: 'green'
            });
        });
        /**
         * Sender make button disconnect
         */
        this.socket.on('make_button_disconnect', function () {
            var div = document.createElement('div');
            div.setAttribute("class", "d-b");

            var container = document.getElementById("console");
            container.appendChild(div);

            var button = document.createElement('button');
            button.innerHTML = "Disconnect";

            div.appendChild(button);
            button.addEventListener("click", function () {


            });

        });

        /**
         * Sender remove line
         */
        this.socket.on('remove_line', function () {
            self.notify('error', 'Private Room', 'Friend refuse invitation');
            self.map.removeLayer(self.sender_line);
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
                    self.socket.emit('handshake_success', data)

                    self.receiver_line = L.polyline(connection_data.gps, {
                        color: 'green',
                        opacity: 1,
                        weight: 2
                    }).addTo(self.map);

                    self.notify('info', 'Private Room', 'Connected to user');

                    return true;
                } else {
                    self.moving = true;
                    self.enabled = true;
                    self.socket.emit('handshake_failed', data);
                    self.notify('error', 'Private Room', 'Refused invitation');
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

    private disableMap = (): void => {
        this.map.scrollWheelZoom.disable()
        this.map.dragging.disable()
        this.map.touchZoom.disable()
        this.map.doubleClickZoom.disable()
        this.map.boxZoom.disable()
        this.map.keyboard.disable()

        if (this.map.tap)
            this.map.tap.disable()

        this.map._handlers.forEach(function (handler: any) {
            handler.disable();

        });
    }

    private disableUser = (): void => {
        this.enabled = false;
        this.moving = false;
    }


    private changeStatusHtml = (): void => {
        document.getElementById("status_toolbar").innerHTML = "  <i class=\"fas fa-ban danger\"></i>&nbsp;disconnected";
    }


    /**
     * Init map
     */
    private initMap = (): void => {

        this.map = L.map('map').setView([this.lat, this.lng], 14);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.token, {
            attribution: '',
            maxZoom: 16,
            id: 'mapbox.streets-satellite',
            accessToken: this.token
        }).addTo(this.map);

    }

    /**
     * Set user marker
     * @return void
     */
    private setUserMarker = (): void => {
        var item = this.icons[this.markerType];
        this.marker = L.marker([this.lat, this.lng], { icon: item }).addTo(this.map);
    }


    /**
     * Trigger map events
     * @return void
     */
    private mapEvents = (): void => {
        var self = this;
        this.map.on('click', function (event: any) {

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
