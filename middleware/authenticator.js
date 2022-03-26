import jsonwebtoken from "jsonwebtoken";
import config from "config";

function authenticate(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        const decoded = jsonwebtoken.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }

}
export { authenticate as Authenticate };
