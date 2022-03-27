import 'express-async-errors';                                  // async middleware for handling HTTP async
import express from 'express';                                  // main route server
//import { Logger } from './middleware/logger.js';              // custom logger (not used)
//import { Authenticate } from './middleware/authenticator.js'; // custom auth (not used)
import helmet from 'helmet';                                    // HTTP Protection
import morgan from 'morgan';                                    // HTTP request logger.
import config from 'config';                                    // Env Manager
import debugModule from 'debug';                                // debug options
import mongoose from 'mongoose';                                // Mongo DB CRUD tool
import error from './middleware/error.js';                      // Custom Error Middleware
import * as winston from 'winston';                             // Logging
import 'winston-mongodb';                                       // DB Transport for Winston

/// ROUTES
import { temperatureRouter } from './routes/temperatures.js';
import { customerRouter } from './routes/customers.js';
import { homeRouter } from './routes/home.js';
import { userRouter } from './routes/users.js';
import { authRouter } from './routes/auth.js';


// Verify jwtPrivateKey ENV set
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey not defined');
    process.exit(1);
}

//Database setup
const DATABASEUSERNAME = config.get('db.dbUser');
const DATABASEPASSWORD = config.get('db.dbPass');
const DATABASEHOST = config.get('db.dbHost');
const DATABASEPORT = config.get('db.dbPort');
const DATABASENAME = 'datapipes';
// Connect to mongodb
const connect = async () => {
    let url = `mongodb://${DATABASEHOST}:${DATABASEPORT}/${DATABASENAME}`;

    mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        authSource: "admin",
        user: DATABASEUSERNAME,
        pass: DATABASEPASSWORD
    }).then(() => { console.log("Database is connected!") }).catch((error) => {
        console.log(error);
    })
}

connect()

// Logging 
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
            db: `mongodb://${DATABASEUSERNAME}:${DATABASEPASSWORD}@${DATABASEHOST}:${DATABASEPORT}/${DATABASENAME}`,
            options: { useUnifiedTopology: true, }
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


// Debug
const debug = new debugModule('app:startup');
debug('Application Name: ' + config.get('name'))
debug('Mail Server: ' + config.get('mail.host'))
debug('Mail Password: ' + config.get('mail.password'))

// Middleware 
const app = express();
app.set('view engine', 'pug'); // HTML templating engine
app.set('views', './views');  // default path for HTML templates
app.use(express.json());  // populates req.body property
app.use(express.urlencoded({ extended: true })); // parses URL payloads: key=value&key=value //extened allow array and other complex objects
app.use(express.static('public')); // serve static content from directory
app.use(helmet()); // Helps secure your apps by setting various HTTP headers.
app.use('/api/tempReadings', temperatureRouter);
app.use('/api/customers', customerRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter)
app.use('/', homeRouter);
app.use(error)

if (app.get('env') === 'development') {
    app.use(morgan('tiny')) // HTTP request logger.
    debug('Morgan Enabled');
}

const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})

export { logger as Logger }