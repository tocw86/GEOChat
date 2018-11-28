export function generateString(): string {
    return Math.random().toString(36).replace('0.', '');
}

/**
* get random string
* 
* @param len 
* @param charSet 
*/
export function randomString(len: number, charSet?: string): string {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}