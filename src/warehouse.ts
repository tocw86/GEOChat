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
            user_id: user.user_id,
            privateKey: privateKey,
            publicKey: publicKey
        });
    }

    public getUsers(): Array<any> {
        return this.users;
    }

    public removeUser(user_id:string):void{
        var self = this;
        this.users.map(function(item,key){
            if(user_id == item.user_id){
                self.users.splice(key,1);
            }
        });
      
    }

}