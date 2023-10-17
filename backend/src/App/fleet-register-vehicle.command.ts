import { Fleet } from '../Domain/Fleet';
import { Vehicle } from '../Domain/Vehicle';
import { Repository } from '../Domain/spi';
import { Command } from './command';

export class FleetRegisterVehicleCommand implements Command{
    #repository:Repository;
    #fleetId: number;
    #vehiclePlateNumber:string;

    constructor(repository:Repository, params:string[]) {
        const [fleetId, vehiclePlateNumber] = params;
        this.#repository =repository;
        this.#fleetId = parseInt(fleetId);
        this.#vehiclePlateNumber = vehiclePlateNumber;
    }

    async execute() {
        if(!this.#fleetId && this.#vehiclePlateNumber){
            throw new Error('FleetRegisterVehicleCommand execute: no fleetId or vehiclePlateNumber');
        }
            const fleet = await Fleet.get(this.#repository.fleetRepository,this.#fleetId);

            const vehicle = new Vehicle(this.#vehiclePlateNumber);
            const message = await fleet.registerVehicile(this.#repository.fleetRepository, vehicle);
           
            if(message){
                console.log(message);
            }
     }
}