"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var crypto = require("crypto-browserify");
var Auth = /** @class */ (function () {
    function Auth(publicKey, privateKey, lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.enabled = true;
        console.log('Zapisano dane usera');
    }
    Auth.prototype.isEnabled = function () {
        return this.enabled;
    };
    Auth.prototype.encrypt = function (plaintext) {
        if (!this.enabled)
            return plaintext;
        var buffer = new buffer_1.Buffer(plaintext);
        var encrypted = crypto.privateEncrypt(this.privateKey, buffer);
        return encrypted.toString('base64');
    };
    Auth.prototype.decrypt = function (cypher) {
        if (!this.enabled)
            return cypher;
        var buffer = buffer_1.Buffer.from(cypher, 'base64');
        var plaintext = crypto.publicDecrypt(this.publicKey, buffer);
        return plaintext.toString('utf8');
    };
    return Auth;
}());
exports.Auth = Auth;
