
import 'express-async-errors';                                  // async middleware for handling HTTP async
import * as winston from 'winston';                             // Logging
import 'winston-mongodb';                                       // DB Transport for Winston
import * as db from '../startup/db.js'                          // Db

export const dbLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.metadata()
    ),
    defaultMeta: { service: 'Mongo Database' },
    transports: [
        new winston.transports.MongoDB({
            level: 'info',
            db: `mongodb://${db.DATABASEUSERNAME}:${db.DATABASEPASSWORD}@${db.DATABASEHOST}:${db.DATABASEPORT}/${db.DATABASENAME}`,
            options: {
                // ORIGINAL LOGGER SETTINGS ************
                useUnifiedTopology: true,
                authSource: "admin",
                // *************************************

            }
        })
    ]
});


export const fileLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.metadata()
    ),
    defaultMeta: { service: 'fileLogger' },
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
    ]
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.metadata(),
        winston.format.colorize()
    ),
    defaultMeta: { service: 'your-service-name' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new winston.transports.MongoDB({
            level: 'error',
            db: `mongodb://${db.DATABASEUSERNAME}:${db.DATABASEPASSWORD}@${db.DATABASEHOST}:${db.DATABASEPORT}/${db.DATABASENAME}`,
            options: { useUnifiedTopology: true, authSource: "admin" }
        }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
        new winston.transports.Console({ colorize: true, prettyPrint: true, level: 'info' })
    ]
});
export default function () {
    // Handle uncaught exceptions durring synchronous calls
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, ex);
        // Logger must finish prior to exiting
        logger.on('finish', () => {
            process.exit(1);
        });
    })
    // Sychronous Error
    //throw new Error('something failed during startup');
    process.on('unhandledRejection', (ex) => {
        logger.error(ex.message, ex);
        // Logger must finish prior to exiting
        logger.on('finish', () => {
            process.exit(1);
        });
    })
    // Asynchronous Error
    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(() => { console.log("done") })
}