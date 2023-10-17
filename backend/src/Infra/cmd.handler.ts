import { Command } from '../App/command';
import { FleetCreateCommand } from '../App/fleet-create.command';
import { FleetLocalizeVehicleQuery } from '../App/fleet-localize-vehicle.query';
import { FleetRegisterVehicleCommand } from '../App/fleet-register-vehicle.command';
import { Repository } from '../Domain/spi';

export default async function (repository:Repository){
    const [command,...params ] = process.argv.slice(2);

let toExecute:Command|null = null;

try{
switch(command){
    case 'create':
        toExecute = new FleetCreateCommand(repository, params);
        break;
    case 'register-vehicle':
        toExecute = new FleetRegisterVehicleCommand(repository, params);
        break;
    case 'localize-vehicle':
        toExecute = new FleetLocalizeVehicleQuery(repository,params);
        break;    
}
if(!toExecute){
    console.error('Unknow command to execute, check your parameters.');
    return -1;
}

await toExecute.execute();

}

catch(err){
    console.error(err);
}
};
