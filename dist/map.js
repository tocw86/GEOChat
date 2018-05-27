"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Map = /** @class */ (function () {
    function Map() {
        this.key = 'AIzaSyBfzFAWyEyfFRCkVKzRmPl0fIraX1Ln0_U';
    }
    Map.prototype.initMap = function (myData) {
        var myPos = {
            lat: myData.lat,
            lng: myData.lng
        };
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: myPos
        });
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({ position: myPos, map: this.map });
    };
    Map.prototype.updateMarkers = function (usersData) {
    };
    return Map;
}());
exports.Map = Map;
