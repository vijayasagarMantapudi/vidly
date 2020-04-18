const express = require('express')
const fs = require('fs');
const Joi = require('joi')
const _ = require('lodash')
const mongoose = require('mongoose')
// MongoDB and CRUD ops
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
})

const Genre = mongoose.model('Genre', genreSchema)

async function fetchAllGenres() {
    let result = await Genre.find()
    return result
}

async function fetchGenreById(id) {
    return await Genre.findById(id)
}

async function fetchGenreByIdAndUpdate(id, genre) {
    return await Genre.findByIdAndUpdate(id, genre, { new: true})
}

async function createGenre(genre) {
    return await Genre.create(genre)
}

async function deleteGenre(id) {
    return await Genre.findByIdAndRemove(id)
}

function validateGenre(genre) {
    const schema = {
        "name": Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema)
}
const route = express.Router()

route.get('/', async (req, res) => {
    //return res.send(fetchroute())
    let result
    try {
        result = await fetchAllGenres()
    } catch (err) {
        console.log('Error while fetching all genres', err)
    }
    return res.send(result)
})

route.get('/:id', async (req, res) => {
    //const genre = _.find(fetchroute(), { id: Number(req.params.id) })
    let result
    if (!req.params.id) {
        console.log('** Error: no req.params.id found, req.params: ', req.params)
    }
    try {
        result = await fetchGenreById(req.params.id)
    } catch (err) {
        console.log('Error while fetching a genres', err)
    }
    //if (!genre) return res.status(400).send('Genre not found with id: ' + req.params.id)
    return res.send(result)
})

route.post('/', async (req, res) => {
    const genre = {
        name: req.body.name
    }
    const validation = validateGenre(genre)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    // let genres = fetchroute()
    // genre.id= generateId()
    // route.push(genre)
    // updateroute(genres)
    try {
        result = await createGenre(genre)
    } catch (err) {
        console.log('Error while posting a genres', err)
    }
    console.log(result)
    return res.send(result)
})

route.put('/:id', async (req, res) => {
    // let genres = fetchroute()
    // let genre = _.find(genres, { id: Number(req.params.id) })
    // if (!genre) return res.status(400).send('Genre not found with id: ' + req.params.id)
    let genre = {}
    let result
    genre.name = req.body.name
    const validation = validateGenre(req.body)
    if (validation.error) return  res.status(404).send(validation.error.details[0].message)
    //updateroute(genres)
    try {
        result = await fetchGenreByIdAndUpdate(req.params.id, genre)    
    } catch (err) {
        console.log('Error while updating a genres', err.message)
    }
    return res.send(result)
})

route.delete('/:id', async (req, res) => {
    // let genres = fetchroute()
    // const genreIndex = _.findIndex(genres, { id: Number(req.params.id) })
    // if (genreIndex < 0) return res.status(400).send('Genre not found with id: ' + req.params.id)
    // const genre = route.splice(genreIndex, 1)
    // updateroute(genres)
    let result
    if (!req.params.id) {
        console.log('** Error: no req.params.id found, req.params: ', req.params)
    }
    try {
        result = await deleteGenre(req.params.id)    
    } catch (err) {
        console.log('Error while deleting a genres', err)
    }
    return res.send(result)
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