"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Warehouse = /** @class */ (function () {
    function Warehouse() {
        this.users = [];
    }
    /**
     * Insert
     * @param  {any} user
     * @param  {string} privateKey
     * @param  {string} publicKey
     * @returns void
     */
    Warehouse.prototype.insert = function (user) {
        this.users.push(user);
    };
    /**
     * Get users
     * @returns Array
     */
    Warehouse.prototype.getUsers = function () {
        return this.users;
    };
    /**
     * Remove user
     * @param  {string} user_id
     */
    Warehouse.prototype.removeUser = function (user_id) {
        var self = this;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                self.users.splice(key, 1);
            }
        });
    };
    /**
     * Update
     * @param  {any} userData
     */
    Warehouse.prototype.updateData = function (userData) {
        this.users.map(function (item, key) {
            if (userData.user_id == item.user_id) {
                item.lat = userData.lat;
                item.lng = userData.lng;
            }
        });
    };
    /**
     * Check if json type
     * @param  {string} json
     * @returns boolean
     */
    Warehouse.prototype.isJson = function (json) {
        try {
            var obj = JSON.parse(json);
        }
        catch (_a) {
            return false;
        }
        return true;
    };
    /**
     * Chek if user is enabled
     * @param  {string} user_id
     * @returns boolean
     */
    Warehouse.prototype.checkAvaible = function (user_id) {
        var flag = false;
        this.users.map(function (item, key) {
            if (user_id == item.user_id && item.enabled) {
                flag = true;
            }
        });
        return flag;
    };
    /**
     * Disable
     * @param  {string} user_id
     */
    Warehouse.prototype.disable = function (user_id) {
        var flag = false;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                item.enabled = false;
            }
        });
        return flag;
    };
    /**
     * Enable
     * @param  {string} user_id
     */
    Warehouse.prototype.enable = function (user_id) {
        var flag = false;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                item.enabled = true;
            }
        });
        return flag;
    };
    return Warehouse;
}());
exports.Warehouse = Warehouse;
