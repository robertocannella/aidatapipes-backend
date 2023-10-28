import mongoose from "mongoose";
import config from "config";
import * as winston from "../startup/logging.js"
import * as dbug from '../startup/debug.js';                         // Debug 

//Database setup
export const DATABASEUSERNAME = config.get('db.dbUser');
export const DATABASEPASSWORD = config.get('db.dbPass');
export const DATABASEHOST = config.get('db.dbHost');
export const DATABASEPORT = config.get('db.dbPort');
export const DATABASENAME = 'datapipes';

// Connect to mongodb
export default async () => {


    let url = `mongodb://${DATABASEHOST}:${DATABASEPORT}/${DATABASENAME}`;
    //let url = `mongodb://${DATABASEHOST}:${DATABASEPORT}/${DATABASENAME}`;
    //mongodb://qiot:tomato345Wednesday@192.168.1.179:37011/?authSource=admin&readPreference=primary&directConnection=true&ssl=false
    //mongodb://qiot:tomato345Wednesday@192.168.1.179:37011/?authSource=admin&readPreference=primary&directConnection=true&ssl=false
    mongoose.set('debug', true)


    mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
        replicaSet: 'rs0',
        //useNewUrlParser: true,
        family: 4,
        readPreference: "primary",
        useUnifiedTopology: true,
        tls: false,
        directConnection: true,
        authSource: "admin",
        ssl: false,

        user: DATABASEUSERNAME,
        pass: DATABASEPASSWORD
    }).then(() => {
        dbug.debug(`Database is connected ${new Date()}`)
        winston.dbLogger.info(`Database is connected ${new Date()}`)
    }).catch(e => {
        winston.dbLogger.error(`Error: ${e}`);
    })
}
