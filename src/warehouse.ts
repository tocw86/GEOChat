export class Warehouse {

    public users: Array<any>;
    private keys: Array<any>;

    constructor() {
        this.users = [];
        this.keys = [];
    }

    public insert(user: any, privateKey: string, publicKey: string): void {
        this.users.push(user);
        this.keys.push({
            id: user.id,
            privateKey: privateKey,
            publicKey: publicKey
        });
    }

    public getUsers(): Array<any> {
        return this.users;
    }

    public removeUser(id:string):void{
        var self = this;
        this.users.map(function(item,key){
            if(id == item.id){
                self.users.splice(key,1);
            }
        });
      
    }

}