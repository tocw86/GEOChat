import * as keypair from "keypair";
export class FactoryKeys {

    private publicKey: string;
    private privateKey: string;

    constructor() {

        var keys = keypair(2048);
        this.publicKey = keys.public;
        this.privateKey = keys.private;

    }
    public getPrivateKey(): string {
        return this.privateKey;
    }
    public getPublicKey(): string {
        return this.publicKey;
    }

}