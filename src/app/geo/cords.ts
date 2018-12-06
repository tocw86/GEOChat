namespace Cords {
    export class Cords {
        private places: Array<any>;

        constructor() {
            let rome = {
                coords: {
                    latitude: 41.890062,
                    longitude: 12.492549
                }
            };
            let versal = {
                coords: {
                    latitude: 48.804541,
                    longitude: 2.12013
                }
            };

            let everest = {

                coords: {
                    latitude: 28.002726,
                    longitude: 86.852628
                }
            };

            let stone = {
                coords: {
                    latitude: 51.178882,
                    longitude: -1.826226
                }
            };

            let whiteHouse = {
                coords: {
                    latitude: 38.897766,
                    longitude: -77.036504
                }
            };
            let reef = {
                coords: {
                    latitude: -23.442896,
                    longitude: 151.906584
                }
            };
            let kohala = {
                coords: {
                    latitude: 19.829778,
                    longitude: -155.990327
                }
            };

            let antarctica = {
                coords: {
                    latitude: -77.6361805,
                    longitude: 166.4173336
                }
            }

            let amazon = {
                coords: {
                    latitude: -3.142916,
                    longitude: -60.488234
                }
            }

            let mexico = {
                coords: {
                    latitude: 20.682522,
                    longitude: -88.56864
                }
            }

            let galapagos = {
                coords: {
                    latitude: -0.784807,
                    longitude: -91.094924
                }
            }

            let olsztyn = {
                coords: {
                    latitude: 53.77995,
                    longitude: 20.49416
                }
            }

            this.places = new Array();

            this.places.push(rome);
            this.places.push(versal);
            this.places.push(everest);
            this.places.push(stone);
            this.places.push(whiteHouse);
            this.places.push(olsztyn);

        }
        /**
         * get random spawn position
         * @returns any
         */
        public getRandomPlace(): any {
            if (this.places.length > 0) {
                if (this.places.length == 1) {
                    return this.places[0];
                } else {
                    return this.places[this.getRandomNumber(0, this.places.length + 1)];
                }
            } else {
                throw new Error;
            }
        }


        /**
       * Wybiera losową liczbę
       * @param  {number} min
       * @param  {number} max
       * @returns number
       */
        private getRandomNumber(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };


        // coords: {
        //     latitude: 53.77995,
        //     longitude: 20.49416
        //     //egipt latitude: 29.975715,
        //     //egipt longitude: 31.137718
        //     //pasym latitude: 53.6711111,
        //     //pasym longitude: 20.784722222222225
        //     //usa latitude: 37.629562,
        //     //usa  longitude: -116.849556
        // }
    }
}