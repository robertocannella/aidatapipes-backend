import mongoose from 'mongoose';
import Joi from 'joi';



const userValidationSchema = Joi.object({
    nameFirst: Joi.string().min(5).max(50).required(),
    nameLast: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).required(255).required().email(),
    email: Joi.string().min(5).required(255).required()

})

// create model for our objects to store in mongodb
// compile object into mongoose
const User = mongoose.model('User', new mongoose.Schema(
    {
        nameFirst: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        nameLast: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        email1: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024,
        }

    })
);

export { User as User }
export { userValidationSchema as userValidationSchema }