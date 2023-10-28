import mongoose from "mongoose";
import Joi from "joi";

// create model for our objects to store in mongo db
// compile object into mongoose
const System = mongoose.model('System', new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            minlength: 5
        },
        outdoorTemps: [],
        systemDetails: {
            description: String,
            equipmentId: String
        }

    }))
const HydronicZone = mongoose.model('HydronicZone', new mongoose.Schema(
    {
        lineRT: {
            type: Map,
            of: String
        }

    })
);

const joiSystemSchmema = Joi.object({
    systemId: Joi.string().required(),
})
const joiLineRTSchema = Joi.object({
    lineRT: Joi.array().required()
})

export { System, HydronicZone, joiLineRTSchema, joiSystemSchmema }