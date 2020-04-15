const Joi = require('joi')
const _ = require('lodash')
const express = require('express')
const fs = require('fs');

const vidlyApp = express()
vidlyApp.use(express.json())
vidlyApp.listen(3000)

vidlyApp.get('/vidly', (req, res) => {
    return res.send('Vidly App')
})

vidlyApp.get('/vidly/api/genres', (req, res) => {
    return res.send(fetchGenres())
})

vidlyApp.get('/vidly/api/genres/:id', (req, res) => {
    const genre = _.find(fetchGenres(), { id: Number(req.params.id) })
    if (!genre) return res.status(400).send('Genre not found with id: ' + req.params.id)
    return res.send(genre)
})

vidlyApp.post('/vidly/api/genres', (req, res) => {
    const validation = validateGenre(req.body)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    let genres = fetchGenres()
    const genre = {
        id: generateId(),
        name: req.body.name
    }
    genres.push(genre)
    updateGenres(genres)
    return res.send(genre)
})

vidlyApp.put('/vidly/api/genres/:id', (req, res) => {
    let genres = fetchGenres()
    let genre = _.find(genres, { id: Number(req.params.id) })
    if (!genre) return res.status(400).send('Genre not found with id: ' + req.params.id)
    genre.name = req.body.name
    const validation = validateGenre(req.body)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    updateGenres(genres)
    return res.send(genre)
})

vidlyApp.delete('/vidly/api/genres/:id', (req, res) => {
    let genres = fetchGenres()
    const genreIndex = _.findIndex(genres, { id: Number(req.params.id) })
    if (genreIndex < 0) return res.status(400).send('Genre not found with id: ' + req.params.id)
    const genre = genres.splice(genreIndex, 1)
    updateGenres(genres)
    return res.send(genre)
})

function validateGenre(genre) {
    const schema = {
        "name": Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema)
}

function fetchGenres() {
    let rawdata = fs.readFileSync('genres.json')
    return JSON.parse(rawdata);
}

function updateGenres(genres) {
    fs.writeFileSync('genres.json', JSON.stringify(genres))
}

function generateId() {
    const rawdata = fs.readFileSync('constants.json')
    let constants = JSON.parse(rawdata);
    constants.id++
    const id = constants.id
    fs.writeFileSync('constants.json', JSON.stringify(constants))
    return id
}
