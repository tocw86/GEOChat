var Comunicator;
(function (Comunicator_1) {
    var Comunicator = /** @class */ (function () {
        function Comunicator() {
        }
        /**
         * Setter for this
         * @param myContext
         */
        Comunicator.prototype.setMyContext = function (myContext) {
            this.myContext = myContext;
        };
        /**
         * Friend setter
         * @param friendContext
         */
        Comunicator.prototype.setFriendContext = function (friendContext) {
            this.friendContext = friendContext;
        };
        /**
         * Set id
         * @param id
         */
        Comunicator.prototype.setFriendId = function (id) {
            this.friendId = id;
        };
        Comunicator.prototype.setFriendPublicKey = function (key) {
            this.friendPublicKey = key;
        };
        /**
         * Get id
         */
        Comunicator.prototype.getFriendContext = function () {
            return this.friendContext;
        };
        Comunicator.prototype.getFriendPublicKey = function () {
            return this.friendPublicKey;
        };
        Comunicator.prototype.getFriendId = function () {
            return this.friendId;
        };
        return Comunicator;
    }());
    Comunicator_1.Comunicator = Comunicator;
})(Comunicator || (Comunicator = {}));
