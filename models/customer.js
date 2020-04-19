const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    isGold: {
        type: Boolean,
        default: false
    }
})


const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer) {
    const schema = {
        "name": Joi.string().min(3).required(),
        "phone": Joi.string().length(10),
        "isGold": Joi.boolean()
    };
    return Joi.validate(customer, schema)
}

exports.validateCustomer = validateCustomer
exports.Customer = Customer