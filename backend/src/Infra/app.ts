import { Repository } from '../Domain/spi';
import cmdHandler from './cmd.handler';
import { FleetSqlite } from './sqlite/fleet.sqlite';
import { SqliteDatabaseWrapper } from './sqlite/sqlite.wrapper';

export default (async function () {
    const db = new SqliteDatabaseWrapper('./db/sqlitedb.db');
    const repository: Repository = {
        fleetRepository: new FleetSqlite(db)
    }

    await cmdHandler(repository);
    db.close();

}());