const miscRouter = require('express').Router()
const axios = require('axios')

miscRouter.get('/dayFact', async (request, response, next) => {
  try {
    const body = request.body
    const url = `http://numbersapi.com/${body.month}/${body.date}/date`

    const fact = await axios.get(url)

    response.json(fact)
  } catch (error) {
    next(error)
  }
})

module.exports = miscRouter
