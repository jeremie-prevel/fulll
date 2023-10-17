import sqlite3 from 'sqlite3';

export const DB_TABLES={
    
    FLEETS:'fleets',
    VEHICLES: 'vehicles',
    VEHICLES_FLEET: 'vehicles_fleet',
}

export class SqliteDatabaseWrapper {
     #db: sqlite3.Database;
     #dbPath = '';
     #sqliteConfig = sqlite3.verbose();

    constructor(dbPath: string) {
        this.#dbPath = dbPath;
        this.#db = this.initDB();
        this.initTable();
    }

    close() {
        this.#db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
          //  console.debug('Close the database connection.');
        })
    }

    getDBInstance(){
        return this.#db;
    }

    async run(query:string, params:Array<string|number>=[]):Promise<{lastID:number, changes:number}>{

        return new Promise((resolve, reject) =>{
            const that =this;
            that.#db.run(query, params, function(err) {
                const result = this;//seul façon de récupérer le resultat de l'insertion
               // console.debug(`[RUN] ${query} with: `, params);
                if(err){
                    reject(err);
                }
                
                resolve(result);
            })
        });
    }

    async getOne<T>(query:string, params:Array<string|number>=[]):Promise<T>{
        return new Promise((resolve, reject)=>{
            this.#db.get(query, params, function(err, row){
                if(err){
                    reject(err);
                }

               // console.debug('get', row)
                resolve(row as T);
            });
        });
    }

    
    async getAll<T>(query:string, params:Array<string|number>=[]):Promise<T>{
        return new Promise((resolve, reject)=>{
            this.#db.all(query, params, function(err, rows){
                if(err){
                    reject(err);
                }

              //  console.debug('get', rows)
                resolve(rows as T);
            });
        });
    }

    private initDB() {
        return new this.#sqliteConfig.Database(this.#dbPath, (err) => {
            if (err) {
                return console.error(err.message);
            }
           // console.debug('Connected to SQlite database.');
        });
    }

    private initTable() {
        this.#db.serialize(() => {
            this.#db
            .run(`CREATE TABLE IF NOT EXISTS  ${DB_TABLES.FLEETS}([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                [userId] INTEGER)`)
            .run(`CREATE TABLE IF NOT EXISTS  ${DB_TABLES.VEHICLES}(
                [plateNumber] TEXT PRIMARY KEY NOT NULL,
                [location] TEXT)
            `)
            .run(`CREATE TABLE IF NOT EXISTS  ${DB_TABLES.VEHICLES_FLEET}(
                [id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                [vehiclePlateNumber] TEXT,
                [fleetId] INTEGER)
            `)
            ;
        })
    }
}