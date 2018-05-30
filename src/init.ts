class Init {

    private token: string = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ';
    private lat: number;
    private lng: number;
    private user_id: string;
    private map: any;
    private socket: any;
    private marker:any;

    /**
     * Start
     * 
     * @param socket Socket.io
     */
    constructor(socket: any) {

        this.socket = socket;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.run);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    /**
     * Trigger window events
     * @return void
     */
    private windowEvents(): void {
        var self = this;
        window.onunload = function () {
            self.socket.emit('remove_user', self.user_id);
        }
    }

    /**
     * Set user safe data
     * @return void
     */
    private setUserDate = (position: any): void => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.user_id = Math.random().toString(36).substring(7);
    }

    /**
     * Get user data in json format
     * @return string
     */
    private getJsonFromUser = (): string => {
        return JSON.stringify({
            lat: this.lat,
            lng: this.lng,
            user_id: this.user_id
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
     * Trigger all socket events
     * @return void
     */
    private triggerSocketEvents = (): void => {

        this.socket.on('load_users', function (usersData: any) {
            var data = JSON.parse(usersData);
            for (var i = 0; i < data.length; i++) {
                L.marker([data[i].lat, data[i].lng]).addTo(this.map);
            }
        });

        this.socket.on('update_markers', function (usersData: any) {
            var data = JSON.parse(usersData);
            L.marker([data.lat, data.lng]).addTo(this.map);
        });

    }

    /**
     * Init map
     */
    private initMap = ():void => {

        this.map = L.map('map').setView([this.lat, this.lng], 18);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.token, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: this.token
        }).addTo(this.map);

    }

    /**
     * Set user marker
     * @return void
     */
    private setUserMarker = ():void => {
        this.marker = L.marker([this.lat, this.lng]).addTo(this.map);
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

    }
}
