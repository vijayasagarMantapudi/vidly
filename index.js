const express = require('express')
const mongoose = require('mongoose')
const homeRoute = require('./routes/homePage')
const genres = require('./routes/genres')

const vidlyApp = express()
vidlyApp.use(express.json())
vidlyApp.use('/vidly', homeRoute)
vidlyApp.use('/vidly/api/genres', genres)

vidlyApp.listen(3000)
console.log('** listening on 3000')


 mongoose.connect('mongodb://localhost/vidly')
 .then(() => {console.log('connected to vidly db')})
 .catch((err) => {console.log('Error connecting to db:', err)})
