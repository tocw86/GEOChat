import { Buffer } from 'buffer';
import * as keypair from "keypair";
import * as crypto from "crypto-browserify";
import { generateString } from './helpers';
export class Auth {

    private publicKey: string;
    private privateKey: string;
    private enabled: boolean;
    private user_id: string;

    constructor(user_id: string) {

        var keys = keypair(512);

        this.publicKey = keys.public;
        this.privateKey = keys.private;
        this.enabled = true;

        this.user_id = user_id;

        console.log('Zapisano dane usera:' + user_id);
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public encrypt(plaintext: string): string {
        if (!this.enabled)
            return plaintext;

        let buffer = new Buffer(plaintext);
        let encrypted = crypto.privateEncrypt(this.privateKey, buffer);

        return encrypted.toString('base64');
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