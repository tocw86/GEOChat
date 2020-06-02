namespace Map {
    export class Map {

        private map: any;
        private cords: Cords.Cords;
        private defaultPosition: any;
        private token: string = 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNrYXh2MzB3dTA5d2IycXFxdXpqdDBzencifQ.QHeTo5TdhHFOBE4uY0KpaQ';

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
            this.map = L.map('map').setView([51.505, -0.09], 13);

            // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            //     maxZoom: 18,
            //     id: 'mapbox/streets-v11',
            //     tileSize: 512,
            //     zoomOffset: -1,
            //     accessToken: 'pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNrYXh2MzB3dTA5d2IycXFxdXpqdDBzencifQ.QHeTo5TdhHFOBE4uY0KpaQ'
            // }).addTo(this.map);

            // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}' + this.token, {
            //     attribution: '',
            //     maxZoom: 16,
            //     id: "mapbox/streets-v11",
            //     accessToken: this.token
            // }).addTo(this.map);
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