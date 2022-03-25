import express from 'express';
import { User, userValidationSchema } from '../models/user.js';
import _ from 'lodash';

const router = express.Router()

// POST Add user to database
router.post('/', async (req, res) => {
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

    // save to db
    await user.save()

    // return user to client
    res.send(_.pick(user, ['nameFirst', 'nameLast', 'email1']))
});

export { router as userRouter }