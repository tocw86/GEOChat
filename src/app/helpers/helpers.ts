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
         * Length to end of string
         * @returns void
         */
        public triggerInputKeypress():void{
            var self = this;
            (<HTMLInputElement>document.getElementById('chat_box')).addEventListener("input", function (event) {
                if(typeof event.target != undefined){
                    let strLength:number = self.countUtf8((<HTMLInputElement>event.target).value);
                    let size:number = 140 - strLength;
                    let textCounter = (<HTMLDivElement>document.getElementById('text_counter'));
                    textCounter.innerHTML = size.toString();

                    if(size < 10){
                        textCounter.style.color = "#d5243e";
                    }else{
                        textCounter.style.color = "#000000";
                    }
                }
             });
        }
        /**
         * Make click on enterk key
         * @returns void
         */
        public triggerEnterKey(): void {
          
            document.addEventListener("keypress", function onEvent(event) {
                if (event.key === "Enter") {
                    ( < HTMLButtonElement > document.getElementById('send_button')).click();
                }
            });
          
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
            this.triggerEnterKey();
            this.triggerInputKeypress();
        }

        /**
         * Add new message
         * 
         * @param  {string} direction
         * @param  {string} message
         * @returns void
         */
        public makeBubble(direction: string, message: string): any {

            let col = ( < HTMLDivElement > document.createElement("div"));
            if (direction == 'you') {
                col.setAttribute('class', 'col-12 text-right');
            } else {
                col.setAttribute('class', 'col-12 text-left');
            }

            ( < HTMLDivElement > document.getElementById("chat_container_box")).appendChild(col);

            let div = ( < HTMLDivElement > document.createElement("div"));
            div.setAttribute('class', 'bubble-' + direction + ' ' + direction);
            col.appendChild(div);
            div.innerHTML = message;

            return div;
        }

        /**
         * Function to fix native charCodeAt()
         *
         * Now, we can use fixedCharCodeAt("foo€", 3); for multibyte (non-bmp) chars too.
         *
         * @access public
         * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/charCodeAt
         * @note If you hit a non-bmp surrogate, the function will return false
         * @param str String Mixed string to get charcodes
         * @param idx Integer Position of the char to get
         * @return code Integer Result charCodeAt();
         */
        public fixedCharCodeAt(str: string, idx: number): any {
            idx = idx || 0;
            var code = str.charCodeAt(idx);
            var hi, low;
            if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
                hi = code;
                low = str.charCodeAt(idx + 1);
                if (isNaN(low)) {
                    throw 'Kein gültiges Schriftzeichen oder Speicherfehler!';
                }
                return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
            }
            if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
                // We return false to allow loops to skip this iteration since should have already handled high surrogate above in the previous iteration
                return false;
                /*hi = str.charCodeAt(idx-1);
                 low = code;
                 return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;*/
            }
            return code;
        }

        /**
         * Gets size of a UTF-8 string in bytes
         *
         * @autor Frank Neff <fneff89@gmail.com>
         * @license GPL v2
         * @access public
         * @param str String Input string to get bytesize
         * @return result String Size of the input string in bytes
         */
        public countUtf8(str: string): number {
            var result = 0;
            for (var n = 0; n < str.length; n++) {
                var charCode = this.fixedCharCodeAt(str, n);
                if (typeof charCode === "number") {
                    if (charCode < 128) {
                        result = result + 1;
                    } else if (charCode < 2048) {
                        result = result + 2;
                    } else if (charCode < 65536) {
                        result = result + 3;
                    } else if (charCode < 2097152) {
                        result = result + 4;
                    } else if (charCode < 67108864) {
                        result = result + 5;
                    } else {
                        result = result + 6;
                    }
                }
            }
            return result;
        }
    }
}