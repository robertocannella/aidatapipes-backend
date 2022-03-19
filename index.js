import express from 'express';
const currentDate = new Date();

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



const app = express()

app.get('/', (request, response) => {
    response.send(`hello world!!`);
});
app.get('/tempReadings', (request, response) => {
    response.send(tempReadings);
});
app.get('/tempReadings/:id', (request, response) => {
    const sensor = tempReadings.find(t => t.id === parseInt(request.params.id))
    if (!sensor) //404
        response.status(404).send('The sensor with the given ID was not found')
    response.send(sensor);
});


const port = process.env.PORT || 3200
app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})