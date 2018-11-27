namespace User {
    export class User {

        private moving: boolean = true;
        private lat: number;
        private lng: number;
        private user_id: string;
        private connected: boolean = true;
        private enabled: boolean = true;
        private markerType: string;
        private marker: any;

        constructor(id: string, position: any, markerType: string) {
            this.user_id = id;
            this.enabled = true;
            this.lat = position.coords.lat;
            this.lng = position.coords.lng;
            this.markerType = markerType;
        }

        public setLng(lng: number): void {
            this.lng = lng;
        }
        public setLat(lat: number): void {
            this.lat = lat;
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

        public isMoving(): boolean {
            return this.moving;
        }

        public stopMoving(): void {
            this.moving = false;
        }
        public startMoving(): void {
            this.moving = true;
        }

        public isConnected(): boolean {
            return this.connected;
        }

        public disconnect(): void {
            this.connected = false;
        }

        public getMarker(): any {
            return this.marker;
        }

        public setEnable(): void {
            this.enabled = true;
        }
        public disable(): void {
            this.enabled = false;
        }

        public getMarkerType(): string {
            return this.markerType;
        }
        public setMarker(marker: any): void {
            this.marker = marker;
        }
        public getLat(): number {
            return this.lat;
        }
        public getLng(): number {
            return this.lng;
        }
    }
}