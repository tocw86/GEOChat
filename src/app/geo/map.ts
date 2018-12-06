namespace Map {
    export class Map {

        private map: any;
        private cords: Cords.Cords;
        private defaultPosition: any;
        private token: string = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ';

        constructor() {
            this.cords = new Cords.Cords();
            this.defaultPosition = this.cords.getRandomPlace();
        }

        public getMap(): any {
            return this.map;
        }

        public getDefaultPosition(): any {
            return this.defaultPosition;
        }

        public initMap(): void {
            this.map = L.map('map').setView([this.defaultPosition.coords.latitude, this.defaultPosition.coords.longitude], 14);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.token, {
                attribution: '',
                maxZoom: 16,
                id: "mapbox.streets-satellite",
                accessToken: this.token
            }).addTo(this.map);
        }

        public disableMap(): void {
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

    }
}