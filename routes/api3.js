const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// Env vars
const API_BASE_URL = process.env.API_BASE_URL_3
const API_KEY_NAME = process.env.API_KEY_NAME_3
const API_KEY_VALUE = process.env.API_KEY_VALUE_3

// Init cache
let cache = apicache.middleware

router.get('/', cache('2 minutes'), async (req, res, next) => {
  try {
    const searchTerm = req.query
    const params = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${searchTerm}&exsentences=20&exintro=2&explaintext=2&callback=processResponse`

    const apiRes = await needle('get', params)
    const data = apiRes.body

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`)
    }

    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
