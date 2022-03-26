

function admin(req, res, next) {
    // req.user is set in previous middelware functioni (Auth)
    console.log(req.user.isAdmin)
    if (!req.user.isAdmin) return res.status(403).send('Access denied.')

    next();
}

export { admin as IsAdmin }