import express from 'express';
import { User, userValidationSchema } from '../models/user.js';
import _ from 'lodash';
import bcrypt from 'bcrypt'
import { Authenticate } from '../middleware/authenticator.js';

const router = express.Router()

// POST Add user to database
router.post('/', Authenticate, async (req, res) => {
    // Validate input using JOI
    const { error } = userValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    // Check for existing user
    let user = await User.findOne({ email1: req.body.email1 });
    if (user) return res.status(400).send('User already registered');

    // Add new users
    user = new User(_.pick(req.body,
        [
            'nameFirst',
            'nameLast',
            'email1',
            'password'
        ]
    ))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save to db
    await user.save()
    const token = user.generateAuthToken();
    // return user to client
    res.header('x-auth-token', token).send(_.pick(user, ['nameFirst', 'nameLast', 'email1']))
});

export { router as userRouter }