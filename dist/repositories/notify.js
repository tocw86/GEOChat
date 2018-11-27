var Notify;
(function (Notify_1) {
    var Notify = /** @class */ (function () {
        function Notify() {
        }
        /**
         *
         * Make notify
         *
         * @param  {string} type
         * @param  {string} text
         * @param  {string} title
         * @returns void
         */
        Notify.prototype.makeNotify = function (type, text, title, position) {
            vNotify[type]({
                text: text,
                title: title,
                sticky: true,
                position: position || "topRight"
            });
        };
        return Notify;
    }());
    Notify_1.Notify = Notify;
})(Notify || (Notify = {}));
