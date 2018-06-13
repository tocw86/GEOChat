var Init=function(){function e(e,r){var s=this;this.moving=!0,this.token="pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ",this.usersMarkers=[],this.icons={red:L.icon({iconUrl:"marker-icon-red.png",shadowUrl:"marker-shadow.png"}),green:L.icon({iconUrl:"marker-icon-green.png",shadowUrl:"marker-shadow.png"}),blue:L.icon({iconUrl:"marker-icon.png",shadowUrl:"marker-shadow.png"})},this.defaultPosition={coords:{latitude:37.629562,longitude:-116.849556}},this.enabled=!0,this.error=function(){s.run(s.defaultPosition)},this.run=function(e){s.setUserDate(e),s.sendUserData(),s.windowEvents(),s.initMap(),s.setUserMarker(),s.mapEvents(),s.triggerSocketEvents()},this.setUserDate=function(e){s.lat=e.coords.latitude,s.lng=e.coords.longitude,s.user_id=s.socket.id,s.enabled=!0},this.getJsonFromUser=function(){return JSON.stringify({lat:s.lat,lng:s.lng,user_id:s.user_id,markerType:s.markerType,enabled:s.enabled})},this.sendUserData=function(){s.socket.emit("new_user",s.getJsonFromUser())},this.markerFactory=function(e,r,t,n){var o=s,i=s.icons[n],a=L.marker([e,r],{icon:i}).addTo(s.map).on("click",function(e){var r=this;setTimeout(function(){document.getElementById(t).addEventListener("click",function(e){o.startHandshake(t,r)})},50)});return a.bindPopup("<p>"+t+'<br/><button id="'+t+'">Handshake</button></p>'),a},this.startHandshake=function(e,r){s.moving=!1;var t=r.getLatLng(),n=s.marker.getLatLng();s.sender_line=L.polyline([[t.lat,t.lng],[n.lat,n.lng]],{color:"red",opacity:1,weight:2}).addTo(s.map),s.socket.emit("start_connect",JSON.stringify({to:e,from:s.user_id,gps:[[t.lat,t.lng],[n.lat,n.lng]]}))},this.triggerSocketEvents=function(){var o=s;s.socket.on("make_line",function(){o.notify("info","Private Room","Connected to user"),o.sender_line.setStyle({color:"green"})}),s.socket.on("remove_line",function(){o.notify("error","Private Room","Friend refuse invitation"),o.map.removeLayer(o.sender_line),o.enabled=!0,o.moving=!0}),s.socket.on("handshake",function(e){var r=JSON.parse(e);if(r.to==o.user_id&&o.moving)return o.moving=!1,confirm("Handshake from:"+r.from)?(o.enabled=!1,o.socket.emit("handshake_success",e),this.receiver_line=L.polyline(r.gps,{color:"green",opacity:1,weight:2}).addTo(o.map),o.notify("info","Private Room","Connected to user"),!0):(o.moving=!0,o.enabled=!0,o.socket.emit("handshake_failed",e),o.notify("error","Private Room","Refused invitation"),!1)}),s.socket.on("load_users",function(e){for(var r=JSON.parse(e),t=0;t<r.length;t++)if(r[t].user_id!=o.user_id){var n=o.markerFactory(r[t].lat,r[t].lng,r[t].user_id,r[t].markerType);o.usersMarkers.push({user_id:r[t].user_id,marker:n,enabled:r[t].enabled})}}),s.socket.on("load_user",function(e){var r=JSON.parse(e);if(r.user_id!=o.user_id){var t=o.markerFactory(r.lat,r.lng,r.user_id,r.markerType);o.usersMarkers.push({user_id:r.user_id,marker:t,enabled:r.enabled})}}),s.socket.on("move_marker",function(e){for(var r=JSON.parse(e),t=0;t<o.usersMarkers.length;t++)r.user_id==o.usersMarkers[t].user_id&&o.usersMarkers[t].marker.setLatLng({lat:r.lat,lng:r.lng})}),s.socket.on("remove_marker",function(e){for(var r=0;r<o.usersMarkers.length;r++)e==o.usersMarkers[r].user_id&&o.usersMarkers[r].marker.remove()})},this.initMap=function(){s.map=L.map("map").setView([s.lat,s.lng],14),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token="+s.token,{attribution:"",maxZoom:16,id:"mapbox.streets-satellite",accessToken:s.token}).addTo(s.map)},this.setUserMarker=function(){var e=s.icons[s.markerType];s.marker=L.marker([s.lat,s.lng],{icon:e}).addTo(s.map)},this.mapEvents=function(){var r=s;s.map.on("click",function(e){void 0!==r.marker&&r.moving&&(r.lat=e.latlng.lat,r.lng=e.latlng.lng,r.marker.setLatLng(e.latlng),r.updateUserData())})},this.updateUserData=function(){s.socket.emit("update_user",s.getJsonFromUser())},this.socket=e,this.markerType=r,navigator.geolocation?navigator.geolocation.getCurrentPosition(this.run,this.error):alert("Geolocation is not supported by this browser.")}return e.prototype.windowEvents=function(){window.addEventListener("beforeunload",function(e){})},e.prototype.randomString=function(e,r){r=r||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(var t="",n=0;n<e;n++){var o=Math.floor(Math.random()*r.length);t+=r.substring(o,o+1)}return t},e.prototype.notify=function(e,r,t){vNotify[e]({text:r,title:t,sticky:!0})},e}();