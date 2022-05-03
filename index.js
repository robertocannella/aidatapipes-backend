import express from 'express';                                  // main route server
import morgan from 'morgan';                                    // HTTP request logger.
import routes from './startup/route.js';                        // Routes module
import db from './startup/db.js';                               // Db
import * as winston from './startup/logging.js';                // Logging
import conf from './startup/config.js';                         // Configuration
import * as dbug from './startup/debug.js';                     // Debug 
import validation from './startup/validation.js';               // Joi Validation
import cors from 'cors';                                        // Cross Origin Resources
import https from 'https';                                      // HTTPS
import * as fs from 'fs'                                        // File System


// STARTUP 
const app = express(); // <-- Instance of Express
app.use(cors()); // Allow Cross Origin Resource Sharing from all urls

// app.use(cors({
//     origin: 'http://localhost:4200/'
// }));
winston.default();
routes(app);    // <-- Send this instance of express to routes module
db();
conf();
dbug.default();

if (app.get('env') === 'development') {
    app.use(morgan('tiny')) // HTTP request logger.
    dbug.debug('Morgan Enabled');
}

// SSL SERVER (NOTE USING SYNC FUNCTIONS)
// Certificate

const sslServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/dbs.aidatapipes.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dbs.aidatapipes.com/fullchain.pem', 'utf8'),
}, app)

sslServer.listen(3443, () => {
    console.log('Secure Servier on port 3443')
})

const port = process.env.PORT || 3200
app.listen(port, () => {
    winston.fileLogger.info(`listening on port ${port}...${new Date()}}`)
    dbug.debug(`listening on port ${port}...${new Date()}`)
});


