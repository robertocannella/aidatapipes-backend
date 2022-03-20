function authenticate(req, res, next) {
    console.log('authenticating...')
    next();
}

export { authenticate as Authenticate }
