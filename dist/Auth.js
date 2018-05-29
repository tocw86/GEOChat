"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var crypto = require("crypto-browserify");
var Auth = /** @class */ (function () {
    function Auth(publicKey, privateKey, user_id) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.enabled = true;
        this.user_id = user_id;
        console.log('Zapisano dane usera:' + user_id);
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
    Auth.prototype.getId = function () {
        return this.user_id;
    };
    Auth.prototype.getPrivateKey = function () {
        return this.privateKey;
    };
    Auth.prototype.getPublicKey = function () {
        return this.publicKey;
    };
    return Auth;
}());
exports.Auth = Auth;
