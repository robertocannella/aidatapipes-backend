import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempHtmlPath = path.join(__dirname, '..', 'temp.html');

router.get('/', (req, res) => {
    // allow inline script to be executed
    res.set("Content-Security-Policy", "script-src 'sha256-9jElhsVImNS98aplAX1a9ov+GnWj+gTf0rF4MhjZ/xg='");
    res.sendFile(tempHtmlPath)
    // res.render('index', {
    //     title: 'Roberto Cannella',
    //     message: 'Currently implementing DNS changes...  <a href="https://robertocannella-f5b4b.web.app/"> Please vistit projects site </a>'
    // })
});

export { router as homeRouter }