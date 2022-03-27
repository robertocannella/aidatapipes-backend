
import * as winston from 'winston';                             // Logging
import 'winston-mongodb';                                       // DB Transport for Winston
import * as db from '../startup/db.js'                          // Db


export default function () {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
            winston.format.metadata()
        ),
        defaultMeta: { service: 'your-service-name' },
        transports: [
            //
            // - Write to all logs with level `info` and below to `quick-start-combined.log`.
            // - Write all logs error (and below) to `quick-start-error.log`.
            //
            new winston.transports.MongoDB({
                level: 'info',
                db: `mongodb://${db.DATABASEUSERNAME}:${db.DATABASEPASSWORD}@${db.DATABASEHOST}:${db.DATABASEPORT}/${db.DATABASENAME}`,
                options: { useUnifiedTopology: true, authSource: "admin" }
            }),
            new winston.transports.File({ filename: 'quick-start-error.log', level: 'error' }),
            new winston.transports.File({ filename: 'quick-start-combined.log' }),
            new winston.transports.Console({ colorize: true, level: 'info' })
        ]
    });
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