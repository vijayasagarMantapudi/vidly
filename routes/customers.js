const express = require('express')
const mongoose = require('mongoose')
const {Customer, validateCustomer} = require('../models/customer')

async function fetchAllCustomers() {
    let result = await Customer.find()
    return result
}

async function fetchCustomerById(id) {
    return await Customer.findById(id)
}

async function fetchCustomerByIdAndUpdate(id, customer) {
    return await Customer.findByIdAndUpdate(id, customer, { new: true})
}

async function createCustomer(customer) {
    return await Customer.create(customer)
}

async function deleteCustomer(id) {
    return await Customer.findByIdAndRemove(id)
}


const route = express.Router()

route.get('/', async (req, res) => {
    let result
    try {
        result = await fetchAllCustomers()
    } catch (err) {
        console.log('Error while fetching all customers', err)
    }
    return res.send(result)
})

route.get('/:id', async (req, res) => {
    let result
    if (!req.params.id) {
        console.log('** Error: no req.params.id found, req.params: ', req.params)
    }
    try {
        result = await fetchCustomerById(req.params.id)
    } catch (err) {
        console.log('Error while fetching a customers', err)
    }
    return res.send(result)
})

route.post('/', async (req, res) => {
    const customer = {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }
    const validation = validateCustomer(customer)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)

    try {
        result = await createCustomer(customer)
    } catch (err) {
        console.log('Error while posting a customers', err)
    }
    console.log(result)
    return res.send(result)
})

route.put('/:id', async (req, res) => {
    let customer = {}
    let result
    customer.name = req.body.name
    customer.phone = req.body.phone
    customer.isGold = req.body.isGold
    const validation = validateCustomer(req.body)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    try {
        result = await fetchCustomerByIdAndUpdate(req.params.id, customer)    
    } catch (err) {
        console.log('Error while updating a customers', err.message)
    }
    return res.send(result)
})

route.delete('/:id', async (req, res) => {
    let result
    if (!req.params.id) {
        console.log('** Error: no req.params.id found, req.params: ', req.params)
    }
    try {
        result = await deleteCustomer(req.params.id)    
    } catch (err) {
        console.log('Error while deleting a customers', err)
    }
    return res.send(result)
})


module.exports = route