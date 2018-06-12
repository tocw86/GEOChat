var Init=function(){function e(e,r){var o=this;this.token="pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ",this.usersMarkers=[],this.icons={red:L.icon({iconUrl:"leaflet/images/marker-icon-red.png",shadowUrl:"leaflet/images/marker-shadow.png"}),green:L.icon({iconUrl:"leaflet/images/marker-icon-green.png",shadowUrl:"leaflet/images/marker-shadow.png"}),blue:L.icon({iconUrl:"leaflet/images/marker-icon.png",shadowUrl:"leaflet/images/marker-shadow.png"})},this.defaultPosition={coords:{latitude:37.629562,longitude:-116.849556}},this.error=function(){o.run(o.defaultPosition)},this.run=function(e){o.setUserDate(e),o.sendUserData(),o.windowEvents(),o.initMap(),o.setUserMarker(),o.mapEvents(),o.triggerSocketEvents()},this.setUserDate=function(e){o.lat=e.coords.latitude,o.lng=e.coords.longitude,o.user_id=o.randomString(32)},this.getJsonFromUser=function(){return JSON.stringify({lat:o.lat,lng:o.lng,user_id:o.user_id,markerType:o.markerType})},this.sendUserData=function(){o.socket.emit("new_user",o.getJsonFromUser())},this.markerFactory=function(e,r,t,n){var a=o.icons[n],s=L.marker([e,r],{icon:a}).addTo(o.map).on("click",function(e){console.log(this.getLatLng())});return s.bindPopup("<p>"+t+'<br/><button id="'+t+'">Handshake</button></p>').openPopup(),document.getElementById(t).addEventListener("click",function(e){console.log(t)}),s},this.triggerSocketEvents=function(){var a=o;o.socket.on("load_users",function(e){for(var r=JSON.parse(e),t=0;t<r.length;t++)if(r[t].user_id!=a.user_id){var n=a.markerFactory(r[t].lat,r[t].lng,r[t].user_id,r[t].markerType);a.usersMarkers.push({user_id:r[t].user_id,marker:n})}}),o.socket.on("load_user",function(e){var r=JSON.parse(e);if(r.user_id!=a.user_id){var t=a.markerFactory(r.lat,r.lng,r.user_id,r.markerType);a.usersMarkers.push({user_id:r.user_id,marker:t})}}),o.socket.on("move_marker",function(e){for(var r=JSON.parse(e),t=0;t<a.usersMarkers.length;t++)r.user_id==a.usersMarkers[t].user_id&&a.usersMarkers[t].marker.setLatLng({lat:r.lat,lng:r.lng})}),o.socket.on("remove_marker",function(e){for(var r=0;r<a.usersMarkers.length;r++)e==a.usersMarkers[r].user_id&&a.usersMarkers[r].marker.remove()})},this.initMap=function(){o.map=L.map("map").setView([o.lat,o.lng],14),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token="+o.token,{attribution:"",maxZoom:16,id:"mapbox.streets-satellite",accessToken:o.token}).addTo(o.map)},this.setUserMarker=function(){var e=o.icons[o.markerType];o.marker=L.marker([o.lat,o.lng],{icon:e}).addTo(o.map)},this.mapEvents=function(){var r=o;o.map.on("click",function(e){void 0!==r.marker&&(r.lat=e.latlng.lat,r.lng=e.latlng.lng,r.marker.setLatLng(e.latlng),r.updateUserData())})},this.updateUserData=function(){o.socket.emit("update_user",o.getJsonFromUser())},this.socket=e,this.markerType=r,navigator.geolocation?navigator.geolocation.getCurrentPosition(this.run,this.error):alert("Geolocation is not supported by this browser.")}return e.prototype.windowEvents=function(){window.addEventListener("beforeunload",function(e){}),document.getElementById("#map")},e.prototype.randomString=function(e,r){r=r||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(var t="",n=0;n<e;n++){var a=Math.floor(Math.random()*r.length);t+=r.substring(a,a+1)}return t},e}();