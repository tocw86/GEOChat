"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Warehouse = /** @class */ (function () {
    function Warehouse() {
        this.users = [];
        this.keys = [];
    }
    Warehouse.prototype.insert = function (user, privateKey, publicKey) {
        this.users.push(user);
        this.keys.push({
            user_id: user.user_id,
            privateKey: privateKey,
            publicKey: publicKey
        });
    };
    Warehouse.prototype.getUsers = function () {
        return this.users;
    };
    Warehouse.prototype.removeUser = function (user_id) {
        var self = this;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                self.users.splice(key, 1);
            }
        });
    };
    Warehouse.prototype.updateData = function (userData) {
        this.users.map(function (item, key) {
            if (userData.user_id == item.user_id) {
                item.lat = userData.lat;
                item.lng = userData.lng;
            }
        });
    };
    Warehouse.prototype.isJson = function (json) {
        try {
            var obj = JSON.parse(json);
        }
        catch (_a) {
            return false;
        }
        return true;
    };
    return Warehouse;
}());
exports.Warehouse = Warehouse;
