import express from 'express';
import { Logger } from './middleware/logger.js';
import { Authenticate } from './middleware/authenticator.js';
import helmet from 'helmet';
import morgan from 'morgan';
import config from 'config';
import debugModule from 'debug';
import { temperatureRouter } from './routes/temperatures.js';
import { customerRouter } from './routes/customers.js';
import { homeRouter } from './routes/home.js';
import mongoose from 'mongoose';

//Database setup
const DATABASEUSERNAME = config.get('db.dbUser');
const DATABASEPASSWORD = config.get('db.dbPass');
const DATABASEHOST = config.get('db.dbHost');
const DATABASEPORT = config.get('db.dbPort');
const DATABASENAME = 'datapipes';

// connect to mongodb
const connect = async () => {
    let url = `mongodb://${DATABASEHOST}:${DATABASEPORT}/${DATABASENAME}`;


    mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
        useNewUrlParser: true,
        useUnifiedTopology: false,
        authSource: "admin",
        user: DATABASEUSERNAME,
        pass: DATABASEPASSWORD
    }).then(() => { console.log("Database is connected!") }).catch((error) => {
        console.log(error);
        process.exit(1);
    });


}

connect()
// Debug
const debug = new debugModule('app:startup');
// Configuration
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

app.use('/', homeRouter);


if (app.get('env') === 'development') {
    app.use(morgan('tiny')) // HTTP request logger.
    debug('Morgan Enabled');
}

// Custom Middleware
app.use(Logger);
app.use(Authenticate);


const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})

