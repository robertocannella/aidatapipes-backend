import 'express-async-errors';                                  // async middleware for handling HTTP async
import express from 'express';                                  // main route server
//import { Logger } from './middleware/logger.js';              // custom logger (not used)
//import { Authenticate } from './middleware/authenticator.js'; // custom auth (not used)
import morgan from 'morgan';                                    // HTTP request logger.
import config from 'config';                                    // Env Manager
import debugModule from 'debug';                                // debug options
import 'winston-mongodb';                                       // DB Transport for Winston
import routes from './startup/route.js';                        // Routes module
import db from './startup/db.js';                               // Db
import logger from './startup/logging.js';                      // Logging


// SETUP ROUTES 
const app = express(); // <-- Instance of Express
routes(app);    // <-- Send this instance of express to routes module
db();
logger();


// Verify jwtPrivateKey ENV set
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey not defined');
    process.exit(1);
}

// Debug
const debug = new debugModule('app:startup');
debug('Application Name: ' + config.get('name'))
debug('Mail Server: ' + config.get('mail.host'))
debug('Mail Password: ' + config.get('mail.password'))

if (app.get('env') === 'development') {
    app.use(morgan('tiny')) // HTTP request logger.
    debug('Morgan Enabled');
}

const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})
