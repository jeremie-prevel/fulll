import { Fleet } from '../Domain/Fleet';
import { Repository } from '../Domain/spi';
import { Command } from './command';

export class FleetCreateCommand implements Command {
    #repository: Repository;
    #userId: number;

    constructor(repository: Repository, params: string[]) {
        const [userId] = params;
        this.#repository = repository;
        this.#userId = parseInt(userId);

    }

    async execute() {
        if (!this.#userId) {
            throw new Error('FleetCreateCommand execute: no userId');
        }
        const fleet = await Fleet.create(this.#repository.fleetRepository, this.#userId);

        console.log(fleet.id);
    }
}