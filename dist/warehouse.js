"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Warehouse=function(){function e(){this.users=[]}return e.prototype.insert=function(e){this.users.push(e)},e.prototype.getUsers=function(){return this.users},e.prototype.removeUser=function(r){var s=this;this.users.map(function(e,t){r==e.user_id&&s.users.splice(t,1)})},e.prototype.updateData=function(r){this.users.map(function(e,t){r.user_id==e.user_id&&(e.lat=r.lat,e.lng=r.lng)})},e.prototype.isJson=function(e){try{JSON.parse(e)}catch(e){return!1}return!0},e.prototype.checkAvaible=function(r){var s=!1;return this.users.map(function(e,t){r==e.user_id&&e.enabled&&(s=!0)}),s},e.prototype.disable=function(r){return this.users.map(function(e,t){r==e.user_id&&(e.enabled=!1)}),!1},e.prototype.enable=function(r){return this.users.map(function(e,t){r==e.user_id&&(e.enabled=!0)}),!1},e}();exports.Warehouse=Warehouse;