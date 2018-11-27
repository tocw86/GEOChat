"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateString() {
    return Math.random().toString(36).replace('0.', '');
}
exports.generateString = generateString;
/**
* get random string
*
* @param len
* @param charSet
*/
function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
exports.randomString = randomString;
