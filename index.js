import express from 'express';
import bodyParser from 'body-parser'
const currentDate = new Date();

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

var tempReadings = [
    {
        id: 19283,
        data: [{
            timeStamp: currentDate.getTime() + 5 * 60000,
            temperatureF: 88.88
        },
        {
            timeStamp: currentDate.getTime() + 10 * 60000,
            temperatureF: 84.88
        },
        {
            timeStamp: currentDate.getTime() + 15 * 60000,
            temperatureF: 86.89
        }]
    },
    {
        id: 1294,
        data: [{
            timeStamp: currentDate.getTime() + 5 * 60000,
            temperatureF: 32.88
        },
        {
            timeStamp: currentDate.getTime() + 10 * 60000,
            temperatureF: 34.88
        },
        {
            timeStamp: currentDate.getTime() + 15 * 60000,
            temperatureF: 45.89
        }]
    }]

app.get('/', (request, response) => {
    response.send(`hello world!!`);
});
app.get('/api/tempReadings', (request, response) => {
    console.log('eat')
    response.send(tempReadings);
});
app.get('/api/tempReadings/:id', (request, response) => {
    const sensorReading = tempReadings.find(t => t.id === parseInt(request.params.id))
    if (!sensorReading) //404
        response.status(404).send('The sensor with the given ID was not found')
    response.send(sensorReading);
});


app.post('/api/tempReadings', (request, response) => {
    console.log('RequestBody', request.body)
    const currentId = tempReadings.find(t => t.id === parseInt(request.body.id));
    const sensorReading = {
        timeStamp: new Date(),
        temperatureF: request.body.temperatureF
    }
    currentId.data.push(sensorReading);
    response.send(sensorReading)
    console.log(tempReadings)
})
app.use(express.json); //Middleware
const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})