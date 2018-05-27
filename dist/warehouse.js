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
            id: user.id,
            privateKey: privateKey,
            publicKey: publicKey
        });
    };
    Warehouse.prototype.getUsers = function () {
        return this.users;
    };
    return Warehouse;
}());
exports.Warehouse = Warehouse;
