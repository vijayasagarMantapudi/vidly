const express = require('express')

const homeRoute = require('./routes/homePage')
const genres = require('./routes/genres')

const vidlyApp = express()
vidlyApp.use(express.json())
vidlyApp.use('/vidly', homeRoute)
vidlyApp.use('/vidly/api/genres', genres)

vidlyApp.listen(3000)
