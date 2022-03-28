import config from 'config';                                    // Env Manager
import debugModule from 'debug';                                // debug options


export const debug = new debugModule('app:startup');
export default function () {
    // Debug

    debug('Application Name: ' + config.get('name'))
    debug('Mail Server: ' + config.get('mail.host'))
    debug('Mail Password: ' + config.get('mail.password'))
}