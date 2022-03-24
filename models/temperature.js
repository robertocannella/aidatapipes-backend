import mongoose from "mongoose";
import Joi from "joi";

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

export { Sensor, temperatureSchema, joiTemperatureSchema }