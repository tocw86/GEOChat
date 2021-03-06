import { Buffer } from 'buffer';
import * as crypto from "crypto-browserify";
export class Auth {

    private publicKey: string;
    private privateKey: string;
    private enabled: boolean;
    private user_id: string;

    constructor(user_id: string, keys: any) {
        this.publicKey = keys.public;
        this.privateKey = keys.private;
        this.user_id = user_id;
        this.enabled = true;
    }

    public setUserId(user_id: string) {
        this.user_id = user_id;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public encrypt(plaintext: string, friend_pub_key: string): string {
        if (!this.enabled)
            return plaintext;

        let buffer = new Buffer(plaintext);
        let encrypted = crypto.publicEncrypt(friend_pub_key, buffer);

        return encrypted.toString('base64');
    }

    /**
     * Received from friend
     * @param  {string} cypher
     * @param  {string} encrypted
     * @returns string
     */
    public decrypt_received(encrypted: string): string {
        if (!this.enabled)
            return encrypted;

        let buffer = Buffer.from(encrypted, 'base64');
        let plaintext = crypto.privateDecrypt(this.getPrivateKey(), buffer);

        return plaintext.toString('utf8')
    }

    public decrypt(cypher: string): string {
        if (!this.enabled)
            return cypher;

        let buffer = Buffer.from(cypher, 'base64');
        let plaintext = crypto.publicDecrypt(this.publicKey, buffer);

        return plaintext.toString('utf8')
    }

    public getId(): string {
        return this.user_id;
    }

    public getPrivateKey(): string {
        return this.privateKey;
    }
    public getPublicKey(): string {
        return this.publicKey;
    }

}