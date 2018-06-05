var Init=function(){function e(e,r){var t=this;this.token="pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ",this.usersMarkers=[],this.icons={red:L.icon({iconUrl:"leaflet/images/marker-icon-red.png",shadowUrl:"leaflet/images/marker-shadow.png"}),green:L.icon({iconUrl:"leaflet/images/marker-icon-green.png",shadowUrl:"leaflet/images/marker-shadow.png"}),blue:L.icon({iconUrl:"leaflet/images/marker-icon.png",shadowUrl:"leaflet/images/marker-shadow.png"})},this.defaultPosition={coords:{latitude:51.1739726374,longitude:-1.82237671048}},this.error=function(){t.run(t.defaultPosition)},this.run=function(e){t.setUserDate(e),t.sendUserData(),t.windowEvents(),t.initMap(),t.setUserMarker(),t.mapEvents(),t.triggerSocketEvents()},this.setUserDate=function(e){t.lat=e.coords.latitude,t.lng=e.coords.longitude,t.user_id=Math.random().toString(36).substring(7)},this.getJsonFromUser=function(){return JSON.stringify({lat:t.lat,lng:t.lng,user_id:t.user_id,markerType:t.markerType})},this.sendUserData=function(){t.socket.emit("new_user",t.getJsonFromUser())},this.triggerSocketEvents=function(){var n=t;t.socket.on("load_users",function(e){for(var r=JSON.parse(e),t=0;t<r.length;t++)if(r[t].user_id!=n.user_id){var s=n.icons[r[t].markerType],a=L.marker([r[t].lat,r[t].lng],{icon:s}).addTo(n.map);n.usersMarkers.push({user_id:r[t].user_id,marker:a})}}),t.socket.on("load_user",function(e){var r=JSON.parse(e);if(r.user_id!=n.user_id){var t=n.icons[r.markerType],s=L.marker([r.lat,r.lng],{icon:t}).addTo(n.map);n.usersMarkers.push({user_id:r.user_id,marker:s})}}),t.socket.on("move_marker",function(e){for(var r=JSON.parse(e),t=0;t<n.usersMarkers.length;t++)r.user_id==n.usersMarkers[t].user_id&&n.usersMarkers[t].marker.setLatLng({lat:r.lat,lng:r.lng})}),t.socket.on("remove_marker",function(e){for(var r=0;r<n.usersMarkers.length;r++)e==n.usersMarkers[r].user_id&&n.usersMarkers[r].marker.remove()})},this.initMap=function(){t.map=L.map("map").setView([t.lat,t.lng],12),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token="+t.token,{attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',maxZoom:18,id:"mapbox.streets",accessToken:t.token}).addTo(t.map)},this.setUserMarker=function(){var e=t.icons[t.markerType];t.marker=L.marker([t.lat,t.lng],{icon:e}).addTo(t.map)},this.mapEvents=function(){var r=t;t.map.on("click",function(e){void 0!==r.marker&&(r.lat=e.latlng.lat,r.lng=e.latlng.lng,r.marker.setLatLng(e.latlng),r.updateUserData())})},this.updateUserData=function(){t.socket.emit("update_user",t.getJsonFromUser())},this.socket=e,this.markerType=r,navigator.geolocation?navigator.geolocation.getCurrentPosition(this.run,this.error):alert("Geolocation is not supported by this browser.")}return e.prototype.windowEvents=function(){var r=this;window.addEventListener("beforeunload",function(e){r.socket.emit("remove_user",r.user_id)})},e}();