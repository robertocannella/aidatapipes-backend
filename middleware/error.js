import logger from '../startup/logging.js'

export default function (err, req, res, next) {
    // log the exception
    logger.error(err.message, err);
    res.status(500).send('Something failed.')
}