namespace User {
    export class User {
        private moving: boolean = true;
        private lat: number;
        private lng: number;
        private user_id: string;
        private connected: boolean = true;
        private enabled: boolean = true;
        private markerType: string;

        constructor(id: string, position: any, markerType: string) {
            this.user_id = id;
            this.enabled = true;
            this.lat = position.cords.lat;
            this.lng = position.cords.lng;
            this.markerType = markerType;
        }

        public getUserId(): string {
            return this.user_id;
        }

        /**
         * Get user data in json format
         * @return string
         */
        public getJsonFromUser(): string {
            return JSON.stringify({
                lat: this.lat,
                lng: this.lng,
                user_id: this.user_id,
                markerType: this.markerType,
                enabled: this.enabled
            });
        }
    }
}