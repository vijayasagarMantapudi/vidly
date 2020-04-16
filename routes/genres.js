const express = require('express')
const fs = require('fs');
const Joi = require('joi')
const _ = require('lodash')

function validateGenre(genre) {
    const schema = {
        "name": Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema)
}
const route = express.Router()

route.get('/', (req, res) => {
    return res.send(fetchroute())
})

route.get('/:id', (req, res) => {
    const genre = _.find(fetchroute(), { id: Number(req.params.id) })
    if (!genre) return res.status(400).send('Genre not found with id: ' + req.params.id)
    return res.send(genre)
})

route.post('/', (req, res) => {
    const genre = {
        name: req.body.name
    }
    const validation = validateGenre(genre)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    let genres = fetchroute()
    genre.id= generateId()
    route.push(genre)
    updateroute(genres)
    return res.send(genre)
})

route.put('/:id', (req, res) => {
    let genres = fetchroute()
    let genre = _.find(genres, { id: Number(req.params.id) })
    if (!genre) return res.status(400).send('Genre not found with id: ' + req.params.id)
    genre.name = req.body.name
    const validation = validateGenre(req.body)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    updateroute(genres)
    return res.send(genre)
})

route.delete('/:id', (req, res) => {
    let genres = fetchroute()
    const genreIndex = _.findIndex(genres, { id: Number(req.params.id) })
    if (genreIndex < 0) return res.status(400).send('Genre not found with id: ' + req.params.id)
    const genre = route.splice(genreIndex, 1)
    updateroute(genres)
    return res.send(genre)
})

function fetchroute() {
    let rawdata = fs.readFileSync('data/genres.json')
    return JSON.parse(rawdata);
}

function updateroute(genres) {
    fs.writeFileSync('data/genres.json', JSON.stringify(genres))
}

function generateId() {
    const rawdata = fs.readFileSync('data/constants.json')
    let constants = JSON.parse(rawdata);
    constants.id++
    const id = constants.id
    fs.writeFileSync('data/constants.json', JSON.stringify(constants))
    return id
}

module.exports = route