import mongoose from 'mongoose';
import Joi from 'joi';



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