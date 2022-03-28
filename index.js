import express from 'express';                                  // main route server
import morgan from 'morgan';                                    // HTTP request logger.
import routes from './startup/route.js';                        // Routes module
import db from './startup/db.js';                               // Db
import * as winston from './startup/logging.js';                      // Logging
import conf from './startup/config.js';                         // Configuration
import * as dbug from './startup/debug.js';                         // Debug 
import validation from './startup/validation.js';               // Joi Validation

// STARTUP 
const app = express(); // <-- Instance of Express
winston.default();
routes(app);    // <-- Send this instance of express to routes module
db();
conf();
dbug.default();

if (app.get('env') === 'development') {
    app.use(morgan('tiny')) // HTTP request logger.
    dbug.debug('Morgan Enabled');
}

const port = process.env.PORT || 3200
app.listen(port, () => {
    winston.fileLogger.info(`listening on port ${port}...${new Date()}}`)
    dbug.debug(`listening on port ${port}...${new Date()}`)
});
