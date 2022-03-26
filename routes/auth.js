import express from 'express';
import { User } from '../models/user.js';
import _ from 'lodash';
import bcrypt from 'bcrypt'
import Joi from 'joi';


const router = express.Router()

// POST Auth user
router.post('/', async (req, res) => {
    // Validate input using JOI
    const { error } = userAuthSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // Verify user exists 
    let user = await User.findOne({ email1: req.body.email1 });
    if (!user) return res.status(400).send('Invalid email or password');

    // Verify password
    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if (!validatePassword) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    res.send(token);
});

const userAuthSchema = Joi.object({
    email1: Joi.string().min(5).required(255).required().email(),
    password: Joi.string().min(8).max(255).required()
})
export { router as authRouter }
