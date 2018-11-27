declare var vNotify: any;

namespace Notify {
    export class Notify {
        /**
         * 
         * Make notify
         * 
         * @param  {string} type
         * @param  {string} text
         * @param  {string} title
         * @returns void
         */
        public makeNotify(type: string, text: string, title: string): void {
            vNotify[type]({
                text: text,
                title: title,
                sticky: true
            });
        }

    }
}