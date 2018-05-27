System.register("Auth", ["buffer", "crypto-browserify"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var buffer_1, crypto, Auth;
    return {
        setters: [
            function (buffer_1_1) {
                buffer_1 = buffer_1_1;
            },
            function (crypto_1) {
                crypto = crypto_1;
            }
        ],
        execute: function () {
            Auth = /** @class */ (function () {
                function Auth(jsonString) {
                    var json = JSON.parse(jsonString);
                    this.lat = json.lat;
                    this.lng = json.lng;
                    this.publicKey = json.publicKey;
                    this.privateKey = json.privateKey;
                    this.enabled = true;
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
            exports_1("Auth", Auth);
        }
    };
});
System.register("Transport", ["Auth"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Auth_1;
    return {
        setters: [
            function (Auth_1_1) {
                Auth_1 = Auth_1_1;
            }
        ],
        execute: function () {
            exports.auth = Auth_1.Auth;
        }
    };
});
