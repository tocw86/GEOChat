import { Buffer } from 'buffer';
import * as crypto from "crypto-browserify";
import { generateString } from './helpers';
export class Auth {

    private publicKey: string;
    private privateKey: string;
    private enabled: boolean;

    private lat: number;
    private lng: number;

    private id: string;
 
    constructor(publicKey: string, privateKey: string, lat: number, lng: number, id:string) {
 
        this.lat = lat;
        this.lng = lng;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.enabled = true;

        this.id = id;

        console.log('Zapisano dane usera');
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public  encrypt(plaintext: string): string {
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
        return this.id;
    }

    public  getLat(): number {
        return this.lat;
    }

    public  getLng(): number {
        return this.lng;
    }
 
    public getPrivateKey():string{
        return this.privateKey;
    }
    public getPublicKey():string{
        return this.publicKey;
    }

}