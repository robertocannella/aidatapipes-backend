import express from 'express';
import Joi from 'joi';
import config from 'config';
import mongoose from 'mongoose';


const router = express.Router()
const sensorSchema = Joi.object({
    id: Joi.number().integer(0).min(0).required(),
    temperatureF: Joi.number().required()
})

// create model for our objects to store in mongo db
// compile object into mongoos
const Sensor = mongoose.model('Sensor', new mongoose.Schema(
    {
        sensorId: {
            type: Number,
            required: true,
            minlength: 5
        },
        data: {
            tempF: Number,

            timeStamp: {
                type: Date, default: Date.now
            }
        },

    })
);
// const userSchema = new Schema(
//     { name: String },
//     { timestamps: true }
// );
async function addSensorReading() {
    // create object
    const sensor = new Sensor({
        sensorId: '090',
        data: {
            tempF: 78
        }
    })

    const result = await sensor.save()
        .then((res) => console.log(res))
        .catch(err => {
            for (let field in err.errors)
                console.log(err.errors[field].message);
        });

}

addSensorReading();
const temperatureSchema = Joi.object({
    timeStamp: Joi.number().integer(0).min(0).required(),
    tempF: Joi.number().required()
})
const joiTemperatureSchema = Joi.object({
    sensorId: Joi.number().integer(0).min(0).required(),
    data: {
        tempF: Joi.number().required()
    }

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

// Gets all sensors and their respective data
router.get('/', async (request, response) => {
    const tempReadings = await Sensor.find().sort('sensorId');
    response.send(tempReadings);
});

// Get all temperature readings at given sensor
router.get('/:id', async (request, response) => {
    const id = request.params.id;
    const sensorReading = await Sensor.find({ sensorId: id });
    if (sensorReading.length < 1) return response.status(404).send('A sensor with the given ID was not found')
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

// STUCK ON DATE TIME URL ENCODING 3/22/2022

// UPDATE a Temperature Reading at a given sensor ID for a given timeStamp
router.put('/:id/:timeStamp', async (request, response) => {
    const timeStamp = new Date(parseInt(request.params.timeStamp));
    //console.log(timeStamp)
    const sensorReading = await Sensor.findByIdAndUpdate(request.params.id, { data: { tempF: request.body.tempF } }, {
        new: true // return objet
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