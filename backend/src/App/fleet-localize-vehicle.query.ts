import { Fleet } from '../Domain/Fleet';
import { Location } from '../Domain/Location';
import { Repository } from '../Domain/spi';
import { Command } from './command';

export class FleetLocalizeVehicleQuery implements Command{
    #repository:Repository;
    #fleetId: number;
    #vehiclePlateNumber: string;
    #lat:string;
    #lng:string;
    #alt:string;

    constructor(repository:Repository, params:string[]) {
        const [fleetId, vehiclePlateNumber, lat,lng, alt] = params;
        this.#repository =repository;
        this.#fleetId=parseInt(fleetId);
        this.#vehiclePlateNumber = vehiclePlateNumber;
        this.#lat= lat;
        this.#lng = lng;
        this.#alt = alt;
    }

    async execute() {
            const fleet = await Fleet.get(this.#repository.fleetRepository,this.#fleetId);
            const location = new Location(this.#lat,this.#lng,this.#alt);
            fleet.localizeVehicle(this.#repository.fleetRepository, this.#vehiclePlateNumber, location);
    }
}