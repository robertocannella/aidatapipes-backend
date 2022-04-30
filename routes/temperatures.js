import express from 'express';
import { Sensor, OutdoorTemp, temperatureSchema, joiTemperatureSchema } from '../models/temperature.js';
//import asyncMiddleware from '../middleware/async.js'  //using express-aysnc-errors

const router = express.Router()

// Gets all sensors and their respective data
router.get('/', async (request, response) => {
    const tempReadings = await Sensor.find().sort('sensorId');
    response.send(tempReadings);
});
//Get current outdoor temperature
router.get('/getCurrentOutdoorTemp', async (request, response) => {
    const currentOutdoorTemp = await OutdoorTemp.findOne().sort({ timeStamp: -1 });
    response.send(currentOutdoorTemp);
})
//Get all temperature readings at given sensor
router.get('/getBySensorId/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const sensorReading = await Sensor.find({ sensorId: id }).catch(e => console.log(e));

    //if (sensorReading.length < 1) return response.status(404).send('A sensor with the given ID was not found')

    if (sensorReading.length < 1) {
        response.status(404).send('A sensor with the given ID was not found');
        // stop further execution in this callback
        return;
    }
    response.send(sensorReading);
});
router.get('/:id', async (request, response) => {
    const sensorReading = await Sensor.findById(request.params.id).catch((e) => {
        response.status(404).send('A sensor with the given ID was not found')
    });

    if (!sensorReading)
        response.status(404).send('A sensor with the given ID was not found')

    response.send(sensorReading);

});
// Adds a temperature reading at a given sensor id
router.post('/:id', async (request, response) => {
    const { error } = temperatureSchema.validate(request.body)
    if (error) return response.status(400).send(error.message);

    //const currentId = tempReadings.find(t => t.id === parseInt(request.body.id));
    //if (!currentId) return response.status(404).send('A sensor with the given ID was not found')

    let sensor = new Sensor({
        sensorId: request.params.id,
        data: {
            tempF: request.body.tempF,
            timeStamp: request.body.timeStamp
        }
    });
    sensor = await sensor.save();

    response.send(sensor)

})

// UPDATE a Temperature Reading at a given sensor ID for a given timeStamp
router.put('/:id', async (request, response) => {
    const sensorReading = await Sensor.findByIdAndUpdate(request.params.id, { data: { tempF: request.body.tempF } }, {
        new: true // return object
    })
    if (!sensorReading) return response.status(404).send('A sensor with the given ID was not found');

    //const { error, result } = temperatureSchema.validate(request.body)
    //if (error) return response.status(400).send(error.message)

    //sensorReading[0].data.tempF = request.body.tempF

    response.send(sensorReading)
})
// DELETE all sensor data at a given id
router.delete('/delete-one/:id', async (request, response) => {

    const currentReading = await Sensor.findByIdAndRemove(request.params.id)
    if (!currentReading) return response.status(404).send('A sensor with the given ID was not found');

    response.send(currentReading)
})
// DELETE all sensor data for a given sensor
router.delete('/delete-many/:sensorId', async (request, response) => {
    const dbResponse = await Sensor.deleteMany({ sensorId: request.params.sensorId })
    if (dbResponse.deletedCount === 0) return response.status(404).send('A sensor with the given ID was not found');

    response.send('Data deleted');

})
export { router as temperatureRouter } 