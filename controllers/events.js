const jwt = require('jsonwebtoken')
const eventsRouter = require('express').Router()
const Event = require('../models/event')
const User = require('../models/user')

eventsRouter.get('/', async (request, response, next) => {
  try {
    const events = await Event.find({})
    response.json(events)
  } catch (error) {
    next(error)
  }
})

eventsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(404).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const eventObject = {
      name: request.body.name,
      date: request.body.Date ? request.body.Date : Date.now(),
      description: request.body.description,
      location: request.body.location,
      startTime: request.body.startTime ? request.body.startTime : '',
      endTime: request.body.endTime ? request.body.endTime : '',
      repeatOption: request.body.repeatOption,
      user: user._id
    }

    const event = new Event(eventObject)

    const savedEvent = await event.save()
    user.events = user.events.concat(savedEvent._id)
    await user.save()
    response.status(201).json(savedEvent)
  } catch (error) {
    next(error)
  }
})

module.exports = eventsRouter
