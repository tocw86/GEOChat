"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
exports.generateString = generateString;
