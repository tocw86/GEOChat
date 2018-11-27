var User;
(function (User_1) {
    var User = /** @class */ (function () {
        function User(id, position, markerType) {
            this.moving = true;
            this.connected = true;
            this.enabled = true;
            this.user_id = id;
            this.enabled = true;
            this.lat = position.coords.lat;
            this.lng = position.coords.lng;
            this.markerType = markerType;
        }
        User.prototype.setLng = function (lng) {
            this.lng = lng;
        };
        User.prototype.setLat = function (lat) {
            this.lat = lat;
        };
        User.prototype.getUserId = function () {
            return this.user_id;
        };
        /**
         * Get user data in json format
         * @return string
         */
        User.prototype.getJsonFromUser = function () {
            return JSON.stringify({
                lat: this.lat,
                lng: this.lng,
                user_id: this.user_id,
                markerType: this.markerType,
                enabled: this.enabled
            });
        };
        User.prototype.isMoving = function () {
            return this.moving;
        };
        User.prototype.stopMoving = function () {
            this.moving = false;
        };
        User.prototype.startMoving = function () {
            this.moving = true;
        };
        User.prototype.isConnected = function () {
            return this.connected;
        };
        User.prototype.disconnect = function () {
            this.connected = false;
        };
        User.prototype.getMarker = function () {
            return this.marker;
        };
        User.prototype.setEnable = function () {
            this.enabled = true;
        };
        User.prototype.disable = function () {
            this.enabled = false;
        };
        User.prototype.getMarkerType = function () {
            return this.markerType;
        };
        User.prototype.setMarker = function (marker) {
            this.marker = marker;
        };
        User.prototype.getLat = function () {
            return this.lat;
        };
        User.prototype.getLng = function () {
            return this.lng;
        };
        return User;
    }());
    User_1.User = User;
})(User || (User = {}));
