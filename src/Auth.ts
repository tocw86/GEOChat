import { Buffer } from 'buffer';
import * as crypto from "crypto-browserify";
import { Helpers } from './Heplers';
export class Auth extends Helpers{

    private publicKey: string;
    private privateKey: string;
    private enabled: boolean;

    private lat: number;
    private lng: number;

    private id: string;
 
    constructor(publicKey: string, privateKey: string, lat: number, lng: number) {
        super();
        this.lat = lat;
        this.lng = lng;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.enabled = true;

        this.id = this.generateString();

        console.log('Zapisano dane usera');
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    encrypt(plaintext: string): string {
        if (!this.enabled)
            return plaintext;

        let buffer = new Buffer(plaintext);
        let encrypted = crypto.privateEncrypt(this.privateKey, buffer);

        return encrypted.toString('base64');
    }


    decrypt(cypher: string): string {
        if (!this.enabled)
            return cypher;

        let buffer = Buffer.from(cypher, 'base64');
        let plaintext = crypto.publicDecrypt(this.publicKey, buffer);

        return plaintext.toString('utf8')
    }

    getId(): string {
        return this.id;
    }

    getLat(): number {
        return this.lat;
    }

    getLng(): number {
        return this.lng;
    }
 

}