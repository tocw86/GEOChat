namespace Comunicator {
    export class Comunicator {


        private myContext: any;
        private friendContext: any;
        private friendId: string;
        private friendPublicKey: string;

        /**
         * Setter for this
         * @param myContext 
         */
        public setMyContext(myContext: any): void {
            this.myContext = myContext;
        }

        /**
         * Friend setter
         * @param friendContext 
         */
        public setFriendContext(friendContext: any): void {
            this.friendContext = friendContext;
        }

        /**
         * Set id
         * @param id 
         */
        public setFriendId(id: string): void {
            this.friendId = id;
        }

        public setFriendPublicKey(key: string): void {
            this.friendPublicKey = key;
        }


        /**
         * Get id
         */
        public getFriendContext(): any {
            return this.friendContext;
        }

        public getFriendPublicKey(): string {
            return this.friendPublicKey;
        }

        public getFriendId(): string {
            return this.friendId;
        }

    }
}