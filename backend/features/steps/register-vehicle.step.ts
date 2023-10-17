import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { Fleet } from '../../src/Domain/Fleet';
import { Vehicle } from '../../src/Domain/Vehicle';
import { Location } from '../../src/Domain/Location';
import { FleetRepository } from '../../src/Domain/spi';

let myFleet: Fleet;
let anotherUserFleet: Fleet;
let aVehicle: Vehicle;
let aLocation: Location;
let errors: string | undefined;

const inmemorydb: { fleets: Fleet[], vehicles: Vehicle[] } = {
  fleets: [],
  vehicles: []
}
const fleetRepository: FleetRepository = {
  create: (userId: number) => {
    const fleet = new Fleet(Date.now(), userId);
    inmemorydb.fleets.push(fleet);

    return Promise.resolve(fleet);
  },
  get: (fleetId: number) => {
    const fleet = inmemorydb.fleets.find(item => item.id === fleetId) ?? new Fleet(fleetId, 1);

    return Promise.resolve(fleet);
  },
  registerVehicle: (fleet: Fleet, vehicleToRegister: Vehicle) => {
    inmemorydb.vehicles.push(vehicleToRegister);
    const savedFleet = inmemorydb.fleets.find(item => item.id === fleet.id) ?? new Fleet(fleet.id, fleet.userId);
    savedFleet.vehicles.push(vehicleToRegister);

    return Promise.resolve(savedFleet);
  },
  parkVehicle: (vehicle: Vehicle) => {
    return Promise.resolve();
  }
};

Given('my fleet', async () => {
  myFleet = await Fleet.create(fleetRepository, 1);
});

Given('a vehicle', () => {
  aVehicle = new Vehicle('aa-aaa-aa');
});

Given('the fleet of another user', async () => {
  anotherUserFleet = await Fleet.create(fleetRepository, 2);
});

Given('this vehicle has been registered into the other user\'s fleet', () => {
  anotherUserFleet.registerVehicile(fleetRepository, aVehicle);
});

Given('I have registered this vehicle into my fleet', () => {
  myFleet.registerVehicile(fleetRepository, aVehicle);
});

When('I register this vehicle into my fleet', () => {
  myFleet.registerVehicile(fleetRepository, aVehicle);
});

When('I try to register this vehicle into my fleet', async () => {
  errors = await myFleet.registerVehicile(fleetRepository, aVehicle);
});

Then('this vehicle should be part of my vehicle fleet', () => {
  const isVehicleRegistered = myFleet.isVehicleRegistered(aVehicle);
  assert.strictEqual(isVehicleRegistered, true);
});

Then('I should be informed this {string}', (message: string) => {
  assert.strictEqual(errors, message);
})

Given('a location', () => {
  aLocation = new Location('48.878110447791116', '2.292828383140722', '');
});

When('I park my vehicle at this location', () => {
  aVehicle.park(aLocation);
});

Then('the known location of my vehicle should verify this location', () => {
  assert.deepStrictEqual(aVehicle.knowLocation(), aLocation);
})

Then('my vehicle has been parked into this location', () => {
  aVehicle.park(aLocation);
})

When('I try to park my vehicle at this location', () => {
  errors = aVehicle.park(aLocation);
})

Then('I should be informed that my vehicle is {string}', (message: string) => {
  assert.ok(errors, message);
})

