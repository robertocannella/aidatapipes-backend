import config from 'config';                                    // Env Manager


export default function () {
    // Verify jwtPrivateKey ENV set
    if (!config.get('jwtPrivateKey'))
        throw new Error.error('FATAL ERROR: jwtPrivateKey not defined');
}