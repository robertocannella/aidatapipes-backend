import express from 'express';
import { Customer, customerSchema } from '../models/customer.js';

const router = express.Router()

// Gets all customers
router.get('/', async (request, response) => {
    const customer = await Customer.find().sort('nameLast');
    response.send(customer);
});
// Get customer by id
router.get('/:id', async (request, response) => {
    const customer = await Customer.findById(request.params.id).catch((e) => {
        response.status(404).send('A customer with the given ID was not found')
    });

    if (!customer)
        response.status(404).send('A customer with the given ID was not found')

    response.send(customer);

});
// Adds a customer
router.post('/', async (request, response) => {
    const { error } = customerSchema.validate(request.body)
    if (error) return response.status(400).send(error.message);


    let customer = new Customer({
        nameFirst: request.body.nameFirst,
        nameLast: request.body.nameLast,
        numberHome: request.body.numberHome
    });
    customer = await customer.save();

    response.send(customer)
})

// UPDATE a CUSTOMER

router.put('/:id', async (request, response) => {


    const customer = await Customer.findByIdAndUpdate(request.params.id,
        {
            nameFirst: request.body.nameFirst,
            nameLast: request.body.nameLast,
            numberHome: request.body.numberHome
        }, { new: true });

    if (!customer) return response.status(404).send('The customer with the given ID was not found.');

    const { error } = customerSchema.validate(request.body);
    if (error) return response.status(400).send(error.details[0].message);
    response.send(customer);
})
// DELETE customer by id
router.delete('/:id', async (request, response) => {

    const customer = await Customer.findByIdAndRemove(request.params.id)
    if (!customer) return response.status(404).send('A customer with the given ID was not found');

    response.send(customer)
})

export { router as customerRouter }