var Init=function(){function e(e,n,t){var s=this;this.moving=!0,this.token="pk.eyJ1IjoidG9jdzg2IiwiYSI6ImNqaHM0YTh2bzA3bDUzN254Mndyb2c4dm0ifQ.3eIb7F5PV-E6pBugRhs4cQ",this.usersMarkers=[],this.icons={red:L.icon({iconUrl:"marker-icon-red.png",shadowUrl:"marker-shadow.png"}),green:L.icon({iconUrl:"marker-icon-green.png",shadowUrl:"marker-shadow.png"}),blue:L.icon({iconUrl:"marker-icon.png",shadowUrl:"marker-shadow.png"})},this.defaultPosition={coords:{latitude:37.629562,longitude:-116.849556}},this.enabled=!0,this.communicator={},this.connected=!0,this.start=function(){s.run(s.defaultPosition)},this.run=function(e){s.setUserDate(e),s.sendUserData(),s.auth=new s.auth(s.user_id),s.initMap(),s.mapEvents(),s.setUserMarker(),s.windowEvents(),s.triggerSocketEvents()},this.setUserDate=function(e){s.lat=e.coords.latitude,s.lng=e.coords.longitude,s.user_id=s.socket.id,s.enabled=!0},this.getJsonFromUser=function(){return JSON.stringify({lat:s.lat,lng:s.lng,user_id:s.user_id,markerType:s.markerType,enabled:s.enabled})},this.sendUserData=function(){s.socket.emit("new_user",s.getJsonFromUser())},this.markerFactory=function(e,n,t,r){var o=s,a=s.icons[r],i=L.marker([e,n],{icon:a}).addTo(s.map).on("click",function(e){var n=this;setTimeout(function(){document.getElementById(t).addEventListener("click",function(e){o.startHandshake(t,n)})},50)});return i.bindPopup("<p>"+t+'<br/><button id="'+t+'">Handshake</button></p>'),i},this.startHandshake=function(e,n){if(s.moving){var t=((s.communicator.me=s).communicator.friend=n).getLatLng(),r=s.marker.getLatLng(),o=s.calculateDistance(r.lat,t.lat,r.lng,t.lng);o<3e3?(s.moving=!1,(s.communicator.me=s).communicator.friend=n,s.communicator.friend_user_id=e,s.socket.emit("start_connect",JSON.stringify({to:e,from:s.user_id,gps:[[t.lat,t.lng],[r.lat,r.lng]],sender_pub_key:s.auth.getPublicKey()}))):alert("To far to make connection ("+o+" m). Min. distance 3000m")}},this.calculateDistance=function(e,n,t,r){var o=.017453292519943295,a=Math.cos,i=.5-a((e-n)*o)/2+a(n*o)*a(e*o)*(1-a((t-r)*o))/2,s=12742*Math.asin(Math.sqrt(i));return Math.round(1e3*s)},this.isConnected=function(){return!(!s.connected||!s.socket.connected)||(s.connected&&!s.socket.connected?(s.notify("error","Disconnected please refresh page","Error"),s.connected=!1,s.cleanAllMarkers(),s.disableMap(),s.disableUser(),s.changeStatusHtml(),!1):!(!s.connected&&!s.socket.connected)&&void 0)},this.triggerSocketEvents=function(){var o=s;s.socket.on("draw_line",function(e){if(e){var n=o.communicator.friend.getLatLng(),t=o.marker.getLatLng();o.sender_line=L.polyline([[n.lat,n.lng],[t.lat,t.lng]],{color:"red",opacity:1,weight:2}).addTo(o.map)}}),s.socket.on("receive_message",function(e){var n=JSON.parse(e);if(n.hasOwnProperty("to")&&n.hasOwnProperty("encrypted")){var t=o.auth.decrypt_received(n.encrypted);o.notify("success",t,"New message")}}),s.socket.on("make_line",function(){o.notify("info","Private Room","Connected to user"),o.sender_line.setStyle({color:"green"}),o.map.closePopup(),o.addSendButton(function(){var e=document.getElementById("chat_box").value,n={encrypted:"",to:""};n.encrypted=o.auth.encrypt(e,o.communicator.friend_pub_key),n.to=o.communicator.friend_user_id,o.socket.emit("send_message",JSON.stringify(n))})}),s.socket.on("save_friend_key",function(e){o.communicator.friend_pub_key=e,console.log("Zapisano klucz publiczny odbiorcy")}),s.socket.on("make_button_disconnect",function(){o.makeButtonDisconnect(function(){alert("nadawca alert")})}),s.socket.on("remove_line",function(){o.notify("error","Private Room","Friend refuse invitation"),o.map.removeLayer(o.sender_line),o.enabled=!0,o.moving=!0}),s.socket.on("handshake",function(e){var t=JSON.parse(e);if(t.to==o.user_id&&o.moving)return o.moving=!1,confirm("Handshake from:"+t.from)?(o.enabled=!1,o.communicator.sender_pub_key=t.sender_pub_key,console.log("Zapisano klucz publiczny nadawcy"),t.friend_pub_key=o.auth.getPublicKey(),o.socket.emit("handshake_success",JSON.stringify(t)),o.receiver_line=L.polyline(t.gps,{color:"green",opacity:1,weight:2}).addTo(o.map),o.notify("info","Private Room","Connected to user"),o.makeButtonDisconnect(function(){alert("odbiorca alert")}),o.addSendButton(function(){var e=document.getElementById("chat_box").value,n={encrypted:o.auth.encrypt(e),to:t.from};o.socket.emit("send_message",JSON.stringify(n))}),!0):(o.moving=!0,o.enabled=!0,o.socket.emit("handshake_failed",e),o.notify("error","Private Room","Refused invitation"),!1)}),s.socket.on("load_users",function(e){for(var n=JSON.parse(e),t=0;t<n.length;t++)if(n[t].user_id!=o.user_id&&n[t].enabled){var r=o.markerFactory(n[t].lat,n[t].lng,n[t].user_id,n[t].markerType);o.usersMarkers.push({user_id:n[t].user_id,marker:r,enabled:n[t].enabled})}}),s.socket.on("load_user",function(e){var n=JSON.parse(e);if(n.user_id!=o.user_id){var t=o.markerFactory(n.lat,n.lng,n.user_id,n.markerType);o.usersMarkers.push({user_id:n.user_id,marker:t,enabled:n.enabled})}}),s.socket.on("move_marker",function(e){for(var n=JSON.parse(e),t=0;t<o.usersMarkers.length;t++)n.user_id==o.usersMarkers[t].user_id&&o.usersMarkers[t].marker.setLatLng({lat:n.lat,lng:n.lng})}),s.socket.on("remove_marker",function(e){for(var n=0;n<o.usersMarkers.length;n++)e==o.usersMarkers[n].user_id&&o.usersMarkers[n].marker.remove()})},this.cleanAllMarkers=function(){for(var e=0;e<s.usersMarkers.length;e++)s.usersMarkers[e].marker.remove();s.marker.remove()},this.disableMap=function(){s.map.scrollWheelZoom.disable(),s.map.dragging.disable(),s.map.touchZoom.disable(),s.map.doubleClickZoom.disable(),s.map.boxZoom.disable(),s.map.keyboard.disable(),s.map.tap&&s.map.tap.disable(),s.map._handlers.forEach(function(e){e.disable()})},this.disableUser=function(){s.enabled=!1,s.moving=!1},this.changeStatusHtml=function(){document.getElementById("status_toolbar").innerHTML='  <i class="fas fa-ban danger"></i>&nbsp;disconnected'},this.addSendButton=function(e){var n=document.createElement("button");n.id="send_button",n.innerHTML="Send",document.getElementById("status_toolbar").appendChild(n),n.addEventListener("click",function(){e()})},this.initMap=function(){s.map=L.map("map").setView([s.lat,s.lng],14),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token="+s.token,{attribution:"",maxZoom:16,id:"mapbox.streets-satellite",accessToken:s.token}).addTo(s.map)},this.setUserMarker=function(){var e=s.icons[s.markerType];s.marker=L.marker([s.lat,s.lng],{icon:e}).addTo(s.map)},this.mapEvents=function(){var n=s;s.map.on("click",function(e){n.isConnected(),void 0!==n.marker&&n.moving&&n.isConnected()&&(n.lat=e.latlng.lat,n.lng=e.latlng.lng,n.marker.setLatLng(e.latlng),n.updateUserData())})},this.updateUserData=function(){s.socket.emit("update_user",s.getJsonFromUser())},this.auth=t,this.socket=e,this.markerType=n}return e.prototype.windowEvents=function(){window.addEventListener("beforeunload",function(e){})},e.prototype.randomString=function(e,n){n=n||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(var t="",r=0;r<e;r++){var o=Math.floor(Math.random()*n.length);t+=n.substring(o,o+1)}return t},e.prototype.notify=function(e,n,t){vNotify[e]({text:n,title:t,sticky:!0})},e.prototype.makeButtonDisconnect=function(e){var n=document.createElement("div");n.setAttribute("class","d-b"),document.getElementById("console").appendChild(n);var t=document.createElement("button");t.innerHTML="Disconnect",n.appendChild(t),t.addEventListener("click",function(){e(),window.location.href="/"})},e}();