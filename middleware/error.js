import { Logger } from '../index.js'

export default function (err, req, res, next) {
    // log the exception
    Logger.error(err.message, err);
    res.status(500).send('Something failed.')
}