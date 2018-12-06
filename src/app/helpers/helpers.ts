namespace Helpers {
    export class Helpers {

        public generateString(): string {
            return Math.random().toString(36).replace('0.', '');
        }

        /**
         * get random string
         * 
         * @param len 
         * @param charSet 
         */
        public randomString(len: number, charSet ? : string): string {
            charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }

        /**
         * Make blur on map
         * @returns void
         */
        public blurChat(): void {
            setTimeout(function () {
                ( < HTMLDivElement > document.getElementById("map")).classList.add("blur");
            }, 500);

        }
        /**
         * Show container
         * @returns void
         */
        public showChatContainer(): void {
            ( < HTMLDivElement > document.getElementById("chat_container")).style.display = "block";
        }

        /**
         * Chat input and button
         * @returns void
         */
        public activateHTML(): void {
            ( < HTMLInputElement > document.getElementById("chat_box")).removeAttribute("disabled");
            ( < HTMLButtonElement > document.getElementById("send_button")).removeAttribute("disabled");
            this.blurChat();
            this.showChatContainer();
        }

        /**
         * Add new message
         * 
         * @param  {string} direction
         * @param  {string} message
         * @returns void
         */
        public makeBubble(direction:string, message:string) : void{
 
            let col =  ( < HTMLDivElement > document.createElement("div"));
            if(direction == 'you'){
                col.setAttribute('class','col-12 text-right');
            }else{
                col.setAttribute('class','col-12 text-left');
            }

            ( < HTMLDivElement > document.getElementById("chat_container_box")).appendChild(col);
       
            let div =  ( < HTMLDivElement > document.createElement("div"));
            div.setAttribute('class', 'bubble-' + direction + ' ' + direction);
            
          
            col.appendChild(div);

            div.innerHTML = message;
        }
    }
}