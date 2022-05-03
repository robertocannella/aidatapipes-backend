import express from 'express';

const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile('/home/roberto/projects/express-demo2/node-tut/temp.html')
    // res.render('index', {
    //     title: 'Roberto Cannella',
    //     message: 'Currently implementing DNS changes...  <a href="https://robertocannella-f5b4b.web.app/"> Please vistit projects site </a>'
    // })
});

export { router as homeRouter } 