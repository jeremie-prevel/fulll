import { Location } from './Location';

const MESSAGE={
    ALREADY_PARK_HERE:"already parked at this location"
}

export class Vehicle {
    #location?:Location;
    plateNumber: string;

    constructor(plateNumber: string) {
        this.plateNumber = plateNumber;
    }


    knowLocation(){
        return this.#location;
    }

    park(location:Location){
        if(this.#location=== location){
            return MESSAGE.ALREADY_PARK_HERE;
        }

        this.#location = location;
    }
}
