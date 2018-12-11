var buffer_1 = require("buffer");
var crypto = require("crypto-browserify");
var Auth = /** @class */ (function () {
    function Auth(user_id, keys) {
        this.publicKey = keys.public;
        this.privateKey = keys.private;
        this.user_id = user_id;
        this.enabled = true;
    }
    Auth.prototype.setUserId = function (user_id) {
        this.user_id = user_id;
    };
    Auth.prototype.isEnabled = function () {
        return this.enabled;
    };
    Auth.prototype.encrypt = function (plaintext, friend_pub_key) {
        if (!this.enabled)
            return plaintext;
        var buffer = new buffer_1.Buffer(plaintext);
        var encrypted = crypto.publicEncrypt(friend_pub_key, buffer);
        return encrypted.toString('base64');
    };
    /**
     * Received from friend
     * @param  {string} cypher
     * @param  {string} encrypted
     * @returns string
     */
    Auth.prototype.decrypt_received = function (encrypted) {
        if (!this.enabled)
            return encrypted;
        var buffer = buffer_1.Buffer.from(encrypted, 'base64');
        var plaintext = crypto.privateDecrypt(this.getPrivateKey(), buffer);
        return plaintext.toString('utf8');
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
auth = Auth;