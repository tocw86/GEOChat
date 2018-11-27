var Map;
(function (Map_1) {
    var Map = /** @class */ (function () {
        function Map() {
            this.defaultPosition = {
                coords: {
                    latitude: 53.77995,
                    longitude: 20.49416
                    //egipt latitude: 29.975715,
                    //egipt longitude: 31.137718
                    //pasym latitude: 53.6711111,
                    //pasym longitude: 20.784722222222225
                    //usa latitude: 37.629562,
                    //usa  longitude: -116.849556
                }
            };
            this.token = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ';
            this.initMap();
        }
        Map.prototype.getMap = function () {
            return this.map;
        };
        Map.prototype.getDefaultPosition = function () {
            return this.defaultPosition;
        };
        Map.prototype.initMap = function () {
            this.map = L.map('map').setView([this.defaultPosition.coords.latitude, this.defaultPosition.coords.longitude], 14);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.token, {
                attribution: '',
                maxZoom: 16,
                id: "mapbox.streets-satellite",
                accessToken: this.token
            }).addTo(this.map);
        };
        Map.prototype.disableMap = function () {
            this.map.scrollWheelZoom.disable();
            this.map.dragging.disable();
            this.map.touchZoom.disable();
            this.map.doubleClickZoom.disable();
            this.map.boxZoom.disable();
            this.map.keyboard.disable();
            if (this.map.tap)
                this.map.tap.disable();
            this.map._handlers.forEach(function (handler) {
                handler.disable();
            });
        };
        return Map;
    }());
    Map_1.Map = Map;
})(Map || (Map = {}));
