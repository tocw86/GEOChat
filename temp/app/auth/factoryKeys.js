var keypair = require("keypair");
var FactoryKeys = /** @class */ (function () {
    function FactoryKeys() {
        var keys = keypair(2048);
        this.publicKey = keys.public;
        this.privateKey = keys.private;
    }
    FactoryKeys.prototype.getPrivateKey = function () {
        return this.privateKey;
    };
    FactoryKeys.prototype.getPublicKey = function () {
        return this.publicKey;
    };
    return FactoryKeys;
}());
factoryKeys = new FactoryKeys();