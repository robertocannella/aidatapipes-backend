import express from 'express';

const router = express.Router()

router.get('/', (req, res) => {
    console.log("sent")
    res.sendFile('/home/roberto/projects/express-demo2/node-tut/temp.html')
    // allow inline script to be executed
    res.set("Content-Security-Policy", "script-src 'sha256-9jElhsVImNS98aplAX1a9ov+GnWj+gTf0rF4MhjZ/xg='");
    // res.render('index', {
    //     title: 'Roberto Cannella',
    //     message: 'Currently implementing DNS changes...  <a href="https://robertocannella-f5b4b.web.app/"> Please vistit projects site </a>'
    // })
});

export { router as homeRouter } 