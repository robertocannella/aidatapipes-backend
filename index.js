import express from 'express';
import { response } from 'express';
import Joi from 'joi'



const currentDate = new Date();
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const schema = Joi.object({
    id: Joi.number().integer(0).min(0).required(),
    temperatureF: Joi.number().required()
})
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

// Gets all sensors and their respective data
app.get('/api/tempReadings', (request, response) => {
    response.send(tempReadings);
});

// Get all temperature readings at given sensor
app.get('/api/tempReadings/:id', (request, response) => {
    const sensorReading = tempReadings.find(t => t.id === parseInt(request.params.id))
    if (!sensorReading)
        response.status(404).send('A sensor with the given ID was not found')

    response.send(sensorReading);
});

// Adds a temperature reading at a given sensor id
app.post('/api/tempReadings', (request, response) => {
    const result = schema.validate(request.body)
    if (result.error)
        response.status(400).send(result.error.message)


    const currentId = tempReadings.find(t => t.id === parseInt(request.body.id));
    if (!currentId)
        response.status(404).send('A sensor with the given ID was not found')

    const sensorReading = {
        timeStamp: new Date().getTime(),
        temperatureF: request.body.temperatureF
    }
    currentId.data.push(sensorReading);
    response.send(sensorReading)

})

// UPDATE A Temperature Reading at a given sensor ID
app.put('/api/tempReadings/:id', (request, response) => {
    const sensorReading = tempReadings.find(t => t.id === parseInt(request.params.id));

    if (!sensorReading) {
        response.status(404).send('A sensor with the given ID was not found')
        return;
    }
    const result = schema.validate(request.body)
    if (result.error)
        response.status(400).send(result.error.message)

    const timeSeries = sensorReading.data.find(data => data.timeStamp === request.body.timeStamp)
    timeSeries.temperatureF = request.body.temperatureF
    response.send(tempReadings)
})

// deletes all sensor data from a given sensor
app.delete('/api/tempReadings/:id', (request, response) => {
    const currentSensor = tempReadings.find(t => t.id === parseInt(request.params.id));
    if (!currentSensor)
        response.status(404).send('A sensor with the given ID was not found')

    const index = tempReadings.indexOf(currentSensor)
    tempReadings.splice(index, 1);

    response.send(currentSensor)
})
// Deletes a temperature reading at given sensor, at a given timestamp
app.delete('/api/tempReadings/:id/:timeStamp', (request, response) => {
    const currentSensor = tempReadings.find(t => t.id === parseInt(request.params.id));
    const currentTimeSeries = currentSensor.data.find(t => t.timeStamp === parseInt(request.params.timeStamp));

    if (!currentSensor)
        response.status(404).send('A Sensor with the given ID was not found')
    if (!currentTimeSeries)
        response.status(404).send(`A time stamp ${request.params.timeStamp} at Sensor ${currentSensor.id} was not found`)

    const sensorIndex = tempReadings.indexOf(currentSensor);
    const timeStampIndex = tempReadings[sensorIndex].data.indexOf(currentTimeSeries);

    tempReadings[sensorIndex].data.splice(timeStampIndex, 1);
    response.send(currentTimeSeries);
})

const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})