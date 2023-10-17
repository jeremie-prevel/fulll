import { Fleet } from '../../Domain/Fleet';
import { Vehicle } from '../../Domain/Vehicle';
import { FleetRepository } from '../../Domain/spi';
import { DB_TABLES, SqliteDatabaseWrapper } from './sqlite.wrapper';

export type FleetEntity = {
    id: number;
    userId: number;
}
export type VehicleEntity = {
    plateNumber: string;
    location: string;
}
export type VehiclesFleetEntity = {
    id: number;
    vehiclePlateNumber: string;
    fleetId: number;
}

export class FleetSqlite implements FleetRepository {
    #db: SqliteDatabaseWrapper;

    constructor(db: SqliteDatabaseWrapper) {
        this.#db = db;
    }

    private fleetEntityToFleet(fleetEntity: FleetEntity): Fleet {
        const fleet = new Fleet(fleetEntity.id, fleetEntity.userId);
        return fleet;
    }
    private vehicleEntityToVehicle(vehicleEntity: VehicleEntity): Vehicle {
        const vehicle = new Vehicle(vehicleEntity.plateNumber);
        return vehicle;
    }

    async create(userId: number): Promise<Fleet> {
        const insertQuery = `INSERT INTO ${DB_TABLES.FLEETS}(userId) VALUES (?)`;
        const selectQuery = `SELECT * FROM ${DB_TABLES.FLEETS} WHERE id = ?`;

        const inserResult = await this.#db.run(insertQuery, [userId]);
        const fleetEntity = await this.#db.getOne<FleetEntity>(selectQuery, [inserResult.lastID]);

        const fleet = this.fleetEntityToFleet(fleetEntity);

        return fleet;
    }


    private async getVehicleOfFleet(fleetId: number): Promise<Vehicle[]> {
        const selectVehiclesOfFleetQuery = `SELECT * FROM ${DB_TABLES.VEHICLES_FLEET} WHERE fleetId = ?`;
        let selectVehicleQuery = `SELECT * FROM ${DB_TABLES.VEHICLES} WHERE plateNumber IN `;

        const vehiclesFleetEntities = await this.#db.getAll<VehiclesFleetEntity[]>(selectVehiclesOfFleetQuery, [fleetId]);
        if (!vehiclesFleetEntities.length) {
            return [];
        }

        let vehiclesPlateNumber: string[] = [];
        const placeholder = vehiclesFleetEntities.map(item => {
            vehiclesPlateNumber.push(item.vehiclePlateNumber);
            return '?';
        }).join(',');

        selectVehicleQuery += `(${placeholder})`;

        const vehiclesEntities = await this.#db.getAll<VehicleEntity[]>(selectVehicleQuery, vehiclesPlateNumber);
        
        const vehicles = vehiclesEntities.map(vehicleEntity => this.vehicleEntityToVehicle(vehicleEntity));
        return vehicles;
    }

    async get(fleetId: number): Promise<Fleet> {
        const selectFleetQuery = `SELECT * FROM ${DB_TABLES.FLEETS} WHERE id = ?`;

        const fleetEntity = await this.#db.getOne<FleetEntity>(selectFleetQuery, [fleetId]);
        const fleet = this.fleetEntityToFleet(fleetEntity);

        fleet.vehicles = await this.getVehicleOfFleet(fleetId);

        return fleet;
    }

    async registerVehicle(fleet: Fleet, vehicleToRegister: Vehicle): Promise<Fleet> {
        
        const selectVehicleQuery = `SELECT * from ${DB_TABLES.VEHICLES} WHERE plateNumber = ?`;
        const vehicleEntity = await this.#db.getOne<VehicleEntity>(selectVehicleQuery, [vehicleToRegister.plateNumber]);

        if (!vehicleEntity) {
            const insertVehicleQuery = `INSERT INTO ${DB_TABLES.VEHICLES}(plateNumber) VALUES(?) `;
            await this.#db.run(insertVehicleQuery, [vehicleToRegister.plateNumber]);
        
        }
        const insertVehicleToFleetQuery = `INSERT INTO ${DB_TABLES.VEHICLES_FLEET} (vehiclePlateNumber, fleetId) VALUES(?,?)`;
        await this.#db.run(insertVehicleToFleetQuery, [vehicleToRegister.plateNumber, fleet.id]);
        
        const savedFleet = await this.get(fleet.id);

        return savedFleet;
    }

    async parkVehicle(vehicle: Vehicle): Promise<void> {
        const updateVehicleQuery = `UPDATE ${DB_TABLES.VEHICLES} SET location=? WHERE plateNumber = ?`;
        const vehicleLocation = vehicle.knowLocation()?.toString();
        if (vehicleLocation) {
            const updateResult = await this.#db.run(updateVehicleQuery, [vehicleLocation, vehicle.plateNumber]);
        }
    }
}
