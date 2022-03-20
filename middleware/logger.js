function log(req, res, next) {
    console.log('logging...')
    next();
}

export { log as Logger }
