class Init {

    private lat: number;
    private lng: number;
    private user_id: string;
    public socket: any;

    constructor(socket: any) {
        var self = this;
        this.socket = socket;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                self.lat = position.coords.latitude;
                self.lng = position.coords.longitude;
                self.user_id = Math.random().toString(36).substring(7);

                socket.emit('new_user', JSON.stringify({
                    lat: self.lat,
                    lng: self.lng,
                    user_id: self.user_id
                }));

                window.onunload = function () {
                    socket.emit('remove_user', self.user_id);
                }


                var token = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ';
                var map = L.map('map').setView([self.lat, self.lng], 18);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + token, {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: token
                }).addTo(map);

                var marker = L.marker([self.lat, self.lng]).addTo(map);

                socket.on('load_users', function (usersData: any) {
                    var data = JSON.parse(usersData);
                    for (var i = 0; i < data.length; i++) {
                        L.marker([data[i].lat, data[i].lng]).addTo(map);
                    }
                });
                socket.on('update_markers', function (usersData: any) {
                    var data = JSON.parse(usersData);
                    L.marker([data.lat, data.lng]).addTo(map);

                });

            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }


    }


}
