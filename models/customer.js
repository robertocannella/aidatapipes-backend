import mongoose from 'mongoose';
import Joi from 'joi';



// Schema for verifying Object Id
const customerIdSchema = Joi.object({
    id: Joi.string()
        .min(24)
        .max(24)
        .regex(/^[0-9a-fA-f]{24}$/)
        .required()
        .label("ObjectID")
        .messages({
            "string.min": "Must have at least 24 characters",
            "object.regex": "Must have at least 24 characters",
            "string.pattern.base": "Failed password requirement check"
        })
})


const customerSchema = Joi.object({
    nameFirst: Joi.string(),
    nameLast: Joi.string().required(),
    numberHome: Joi.number().required()
})

// create model for our objects to store in mongo db
// compile object into mongoos
const Customer = mongoose.model('Customer', new mongoose.Schema(
    {
        nameFirst: { type: String },
        nameLast: {
            type: String,
            required: true,
            minlength: 2
        },
        numberHome: {
            type: Number,
            required: true
        },

    })
);

export { Customer as Customer }
export { customerSchema as customerSchema }
export { customerIdSchema }