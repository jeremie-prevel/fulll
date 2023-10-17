import { Location } from './Location';
import { Vehicle } from './Vehicle';
import { FleetRepository } from './spi';

const MESSAGE = {
  ALREADY_REGISTER: "this vehicle has already been registered into my fleet"
}

export class Fleet {
  vehicles: Vehicle[] = [];
  id: number;
  userId: number;

  constructor(id: number, userId: number) {
    this.id = id;
    this.userId = userId;
  }

  static async create(fleetRepository: FleetRepository, userId: number) {
    const fleet = fleetRepository.create(userId);
    return fleet;
  }

  static async get(fleetRepository: FleetRepository, fleetId: number) {
    const fleet = fleetRepository.get(fleetId);
    return fleet;
  }

  isVehicleRegistered(vehicleToRegister: Vehicle) {
    const vehiculeFounded = this.vehicles.find(vehicle => vehicle.plateNumber === vehicleToRegister.plateNumber);

    return !!vehiculeFounded;
  }

  /**
   * 
   * @param fleetRepository 
   * @param vehicleToRegister 
   * @returns message
   */
  async registerVehicile(fleetRepository: FleetRepository, vehicleToRegister: Vehicle):Promise<string | undefined> {
    const vehicileAlreadyRegistered = this.isVehicleRegistered(vehicleToRegister);

    if (vehicileAlreadyRegistered) {
      return MESSAGE.ALREADY_REGISTER;
    }

    await fleetRepository.registerVehicle(this, vehicleToRegister);
  }

  async localizeVehicle(fleetRepository: FleetRepository,vehiclePlateNumber:string,location:Location){
    const vehicle = this.vehicles.find(vehicle => vehicle.plateNumber === vehiclePlateNumber);
    if(vehicle){
      vehicle.park(location);
      fleetRepository.parkVehicle(vehicle);
    }
  }
}
