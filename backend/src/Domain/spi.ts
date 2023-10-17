import { Fleet } from './Fleet';
import { Vehicle } from './Vehicle';

export interface FleetRepository{
    create(userId:number):Promise<Fleet>;
    get(fleetId:number):Promise<Fleet>;
    registerVehicle(fleet:Fleet, vehicleToRegister:Vehicle):Promise<Fleet>;
    parkVehicle(vehicle: Vehicle): Promise<void>;
}

export interface Repository{
    fleetRepository:FleetRepository;
}