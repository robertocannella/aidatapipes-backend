import express from 'express';

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Temperture Express App',
        message: 'Hello'
    })
});

export { router as homeRouter } 