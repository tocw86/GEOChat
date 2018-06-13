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
            publicKey: publicKey,
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

    public updateData(userData:any){
        this.users.map(function(item,key){
            if(userData.user_id == item.user_id){
                item.lat = userData.lat;
                item.lng = userData.lng;
            }
        });
    }

    public isJson(json:string):boolean{
        try{
            var obj = JSON.parse(json);
        }catch{
            return false;
        }
        return true;
    }

    public checkAvaible(user_id:string) : boolean{
        var flag = false;
        this.users.map(function(item,key){
            if(user_id == item.user_id && item.enabled){
                flag = true;
                return true;
            }
        });
        return flag;
    }
    public hide(user_id:string){
        var flag = false;
        this.users.map(function(item,key){
            if(user_id == item.user_id){
                item.enabled = false;
            }
        });
        return flag;
    }
    public show(user_id:string){
        var flag = false;
        this.users.map(function(item,key){
            if(user_id == item.user_id){
                item.enabled = true;
            }
        });
        return flag;
    }

}