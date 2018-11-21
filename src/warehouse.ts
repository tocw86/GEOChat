export class Warehouse {

    public users: Array<any>;

    constructor() {
        this.users = [];
    }
    /**
     * Insert
     * @param  {any} user
     * @param  {string} privateKey
     * @param  {string} publicKey
     * @returns void
     */
    public insert(user: any): void {
        this.users.push(user);
    }
    /**
     * Get users
     * @returns Array
     */
    public getUsers(): Array<any> {
        return this.users;
    }
    /**
     * Remove user
     * @param  {string} user_id
     */
    public removeUser(user_id: string): void {
        var self = this;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                self.users.splice(key, 1);
            }
        });

    }
    /**
     * Update
     * @param  {any} userData
     */
    public updateData(userData: any) {
        this.users.map(function (item, key) {
            if (userData.user_id == item.user_id) {
                item.lat = userData.lat;
                item.lng = userData.lng;
            }
        });
    }
    /**
     * Check if json type
     * @param  {string} json
     * @returns boolean
     */
    public isJson(json: string): boolean {
        try {
            var obj = JSON.parse(json);
        } catch{
            return false;
        }
        return true;
    }
    /**
     * Chek if user is enabled
     * @param  {string} user_id
     * @returns boolean
     */
    public checkAvaible(user_id: string): boolean {
        var flag = false;
        this.users.map(function (item, key) {
            if (user_id == item.user_id && item.enabled) {
                flag = true;
            }
        });
        return flag;
    }
    /**
     * Disable
     * @param  {string} user_id
     */
    public disable(user_id: string) {
        var flag = false;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                item.enabled = false;
            }
        });
        return flag;
    }
    /**
     * Enable
     * @param  {string} user_id
     */
    public enable(user_id: string) {
        var flag = false;
        this.users.map(function (item, key) {
            if (user_id == item.user_id) {
                item.enabled = true;
            }
        });
        return flag;
    }

}