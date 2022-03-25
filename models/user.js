import mongoose from 'mongoose';
import Joi from 'joi';
import pkg from 'joi-password-complexity';



const userValidationSchema = Joi.object({
    nameFirst: Joi.string().min(2).max(50).required(),
    nameLast: Joi.string().min(2).max(50).required(),
    email1: Joi.string().min(5).required(255).required().email(),
    password: Joi.string()
        .min(8)
        .max(255)
        .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
        .required()
        .label("Password")
        .messages({
            "string.min": "Password must have at least 8 characters",
            "object.regex": "Must have at least 8 characters",
            "string.pattern.base": "Failed password requirement check"
        })

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