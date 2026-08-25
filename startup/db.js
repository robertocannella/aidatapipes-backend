import mongoose from "mongoose";
import config from "config";
import * as winston from "../startup/logging.js"
import * as dbug from '../startup/debug.js';                         // Debug 

//Database setup
export const DATABASEURL = config.get('db.dbUrl');
export const DATABASENAME = 'aidatapipes';

// Connect to mongodb (MongoDB Atlas)
export default async () => {

    mongoose.set('debug', true)

    mongoose.connect(DATABASEURL, {
        dbName: DATABASENAME,
        serverSelectionTimeoutMS: 5000,
    }).then(() => {
        dbug.debug(`Database is connected ${new Date()}`)
        winston.dbLogger.info(`Database is connected ${new Date()}`)
    }).catch(e => {
        winston.dbLogger.error(`Error: ${e}`);
    })
}
