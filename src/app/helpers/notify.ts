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
        public makeNotify(type: string, text: string, title: string, position?: string): void {
            vNotify[type]({
                text: text,
                title: title,
                sticky: false,
                position: position || "topRight",
                autoHide: true,
                clickToHide: true,
                autoHideDelay: 3000,

            });
        }

    }
}