class Init {

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

    /**
     * Start
     * 
     * @param socket Socket.io
     */
    constructor(socket: any, markerType: string) {

        this.socket = socket;
        this.markerType = markerType;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.run, this.error);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
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
        this.user_id = this.randomString(32);
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
            markerType: this.markerType
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
    private markerFactory = (lat:number, lng:number, user_id:string, markerType:string):any => {
        var icon = this.icons[markerType];
        var marker = L.marker([lat, lng], { icon: icon }).addTo(this.map).on('click',function(event:any){
            console.log(this.getLatLng());
        });
        marker.bindPopup('<p>' + user_id + '<br/><button id="'+user_id+'">Handshake</button></p>');
 
            //  document.getElementById(user_id).addEventListener('click', function(e){
            //      console.log(user_id);
            //  });
 

        return marker;
    }

    /**
     * Trigger all socket events
     * @return void
     */
    private triggerSocketEvents = (): void => {
        var self = this;

        /**
         * Load all users
         */
        this.socket.on('load_users', function (usersData: string) {
            var data = JSON.parse(usersData);

            for (var i = 0; i < data.length; i++) {
                if (data[i].user_id != self.user_id) {
                    var marker = self.markerFactory(data[i].lat,data[i].lng,data[i].user_id,data[i].markerType);
                    self.usersMarkers.push(
                        {
                            user_id: data[i].user_id,
                            marker: marker
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
               
                var marker = self.markerFactory(data.lat,data.lng,data.user_id,data.markerType);

                self.usersMarkers.push(
                    {
                        user_id: data.user_id,
                        marker: marker
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

            if (typeof self.marker != 'undefined') {
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
