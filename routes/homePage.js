const express = require('express')
const homeRoute = express.Router()

homeRoute.get('/', (req, res) => {
    return res.send('Vidly App')
})

module.exports = homeRoute