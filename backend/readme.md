# Requirements
To run this project you will need a computer with Node, Typescript and Cucumber installed.

# Install
To install the project, you just have to run `yarn install` to get all the dependencies

# Running the tests
After installing the dependencies you can run the tests with this command `yarn test`.

# DB (sqlite)
located in db/sqlitedb.db

# code structure
       fleet.cmd (entrypoint)  
       => index.js (typescript wrapper) 
       => src/Infra/app.ts (core) 
       => src/Infra/cmd.handler.ts (command line interpreter)

# Commands (windows support)
       ./fleet create <userId> # returns fleetId on the standard output
       ./fleet register-vehicle <fleetId> <vehiclePlateNumber>
       ./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
