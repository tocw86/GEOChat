"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var crypto = require("crypto-browserify");
var Heplers_1 = require("./Heplers");
var Auth = /** @class */ (function (_super) {
    __extends(Auth, _super);
    function Auth(publicKey, privateKey, lat, lng) {
        var _this = _super.call(this) || this;
        _this.lat = lat;
        _this.lng = lng;
        _this.publicKey = publicKey;
        _this.privateKey = privateKey;
        _this.enabled = true;
        _this.id = _this.generateString();
        console.log('Zapisano dane usera');
        return _this;
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
        return this.id;
    };
    Auth.prototype.getLat = function () {
        return this.lat;
    };
    Auth.prototype.getLng = function () {
        return this.lng;
    };
    return Auth;
}(Heplers_1.Helpers));
exports.Auth = Auth;
