import express from 'express';
import Joi from 'joi';
import { Logger } from './logger.js';
import { Authenticate } from './authenticator.js';
import helmet from 'helmet';
import morgan from 'morgan';
import config from 'config';
import debugModule from 'debug';



// Configuration
console.log('Application Name: ' + config.get('name'))
console.log('Mail Server: ' + config.get('mail.host'))
console.log('Mail Password: ' + config.get('mail.password'))

// Debug
const debug = new debugModule('app:startup');

// Middleware
const app = express()
app.set('view engine', 'pug') // HTML templating engine
app.set('views', './views')  // default path for HTML templates
app.use(express.json())  // populates req.body property
app.use(express.urlencoded({ extended: true }))  // parses URL payloads: key=value&key=value //extened allow array and other complex objects
app.use(express.static('public')) // serve static content from directory
app.use(helmet()) // Helps secure your apps by setting various HTTP headers.

if (app.get('env') === 'development') {
    app.use(morgan('tiny')) // HTTP request logger.
    debug('Morgan Enabled');
}

// Custome Middleware
app.use(Logger);
app.use(Authenticate)

const sensorSchema = Joi.object({
    id: Joi.number().integer(0).min(0).required(),
    temperatureF: Joi.number().required()
})
const temperatureSchema = Joi.object({
    timeStamp: Joi.number().integer(0).min(0).required(),
    temperatureF: Joi.number().required()
})
const currentDate = new Date();
var tempReadings = [
    {
        id: 19283,
        data: [{
            timeStamp: currentDate.getTime() + 5 * 60000,
            temperatureF: 88.88
        },
        {
            timeStamp: currentDate.getTime() + 10 * 60000,
            temperatureF: 84.88
        },
        {
            timeStamp: 1647748484997,
            temperatureF: 86.89
        }]
    },
    {
        id: 1294,
        data: [{
            timeStamp: currentDate.getTime() + 5 * 60000,
            temperatureF: 32.88
        },
        {
            timeStamp: currentDate.getTime() + 10 * 60000,
            temperatureF: 34.88
        },
        {
            timeStamp: 1647748484997,
            temperatureF: 45.89
        }]
    }]

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Temperture Express App',
        message: 'Hello'
    })
});
// Gets all sensors and their respective data
app.get('/api/tempReadings', (request, response) => {
    response.send(tempReadings);
});

// Get all temperature readings at given sensor
app.get('/api/tempReadings/:id', (request, response) => {
    const sensorReading = tempReadings.find(t => t.id === parseInt(request.params.id))
    if (!sensorReading) return response.status(404).send('A sensor with the given ID was not found')

    response.send(sensorReading);
});

// Adds a temperature reading at a given sensor id
app.post('/api/tempReadings', (request, response) => {
    const { error } = sensorSchema.validate(request.body)
    if (error) return response.status(400).send(result.error.message);

    const currentId = tempReadings.find(t => t.id === parseInt(request.body.id));
    if (!currentId) return response.status(404).send('A sensor with the given ID was not found')

    const sensorReading = {
        timeStamp: new Date().getTime(),
        temperatureF: request.body.temperatureF
    }
    currentId.data.push(sensorReading);
    response.send(sensorReading)
})

// UPDATE a Temperature Reading at a given sensor ID
app.put('/api/tempReadings/:id', (request, response) => {
    const sensorReading = tempReadings.find(t => t.id === parseInt(request.params.id));
    if (!sensorReading) return response.status(404).send('A sensor with the given ID was not found');

    const { error, result } = temperatureSchema.validate(request.body)
    if (error) return response.status(400).send(error.message)

    const timeSeries = sensorReading.data.find(data => data.timeStamp === request.body.timeStamp)
    timeSeries.temperatureF = request.body.temperatureF;
    response.send(tempReadings)
})

// DELETE all sensor data at a given sensor
app.delete('/api/tempReadings/:id', (request, response) => {
    const currentSensor = tempReadings.find(t => t.id === parseInt(request.params.id));
    if (!currentSensor) return response.status(404).send('A sensor with the given ID was not found');

    const index = tempReadings.indexOf(currentSensor)
    tempReadings.splice(index, 1);

    response.send(currentSensor)
})
// DELETE a temperature reading from given sensor, at a given timestamp
app.delete('/api/tempReadings/:id/:timeStamp', (request, response) => {
    const currentSensor = tempReadings.find(t => t.id === parseInt(request.params.id));
    const currentTimeSeries = currentSensor.data.find(t => t.timeStamp === parseInt(request.params.timeStamp));

    if (!currentSensor) return response.status(404).send('A Sensor with the given ID was not found');
    if (!currentTimeSeries) return response.status(404).send(`A time stamp ${request.params.timeStamp} at Sensor ${currentSensor.id} was not found`)

    const sensorIndex = tempReadings.indexOf(currentSensor);
    const timeStampIndex = tempReadings[sensorIndex].data.indexOf(currentTimeSeries);

    tempReadings[sensorIndex].data.splice(timeStampIndex, 1);
    response.send(currentTimeSeries);
})

const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})