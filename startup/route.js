import express from 'express';                                  // main route server
import 'express-async-errors';                                  // async middleware for handling HTTP async
import error from '../middleware/error.js';                      // Custom Error Middleware
import helmet from 'helmet';                                    // HTTP Protection

// ROUTES
import { temperatureRouter } from '../routes/temperatures.js';
import { customerRouter } from '../routes/customers.js';
import { homeRouter } from '../routes/home.js';
import { userRouter } from '../routes/users.js';
import { authRouter } from '../routes/auth.js';
import { systemRouter } from '../routes/system.js';

export default function (app) {
    // Routes and Middleware 

    app.set('view engine', 'pug'); // HTML templating engine
    app.set('views', './views');  // default path for HTML templates
    app.use(express.json());  // populates req.body property
    app.use(express.urlencoded({ extended: true })); // parses URL payloads: key=value&key=value //extened allow array and other complex objects
    app.use(express.static('public')); // serve static content from directory
    app.use(helmet()); // Helps secure your apps by setting various HTTP headers.
    app.use('/api/systems', systemRouter);
    app.use('/api/tempReadings', temperatureRouter);
    app.use('/api/customers', customerRouter);
    app.use('/api/users', userRouter);
    app.use('/api/auth', authRouter)
    app.use('/', homeRouter);
    app.use(error)
}