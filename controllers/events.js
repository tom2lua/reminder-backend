const jwt = require('jsonwebtoken')
const eventsRouter = require('express').Router()
const Event = require('../models/event')
const User = require('../models/user')

//Fetch all events:
// eventsRouter.get('/', async (request, response, next) => {
//   try {
//     const events = await Event.find({})
//     response.json(events)
//   } catch (error) {
//     next(error)
//   }
// })

//Fetch events from user:
eventsRouter.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const events = await Event.find({ user: decodedToken.id }).populate(
      'eventType',
      { name: 1, iconClass: 1, representColor: 1, cssClass: 1 }
    )
    response.json(events)
  } catch (error) {
    next(error)
  }
})
//Create new Event:
eventsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(404).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const eventObject = {
      name: request.body.name,
      date: request.body.date,
      description: request.body.description,
      location: request.body.location,
      startTime: request.body.startTime ? request.body.startTime : '',
      endTime: request.body.endTime ? request.body.endTime : '',
      repeatOption: request.body.repeatOption,
      eventType: request.body.eventTypeId,
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

//Update Event:
eventsRouter.put('/:id', async (request, response, next) => {
  const eventObject = {
    name: request.body.name,
    date: request.body.date,
    description: request.body.description,
    location: request.body.location,
    startTime: request.body.startTime ? request.body.startTime : '',
    endTime: request.body.endTime ? request.body.endTime : '',
    repeatOption: request.body.repeatOption,
    eventType: request.body.eventType.id
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      request.params.id,
      eventObject,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    ).populate('eventType', {
      name: 1,
      iconClass: 1,
      representColor: 1,
      cssClass: 1
    })
    response.json(updatedEvent)
  } catch (error) {
    next(error)
  }
})

//Delete Event
eventsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const event = await Event.findById(request.params.id)
    if (event.user.toString() === decodedToken.id.toString()) {
      const result = await Event.findByIdAndRemove(request.params.id)
      response.status(204).send(result)
    } else {
      response
        .status(400)
        .json({ error: "this user don't have the right to delete this Event" })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = eventsRouter
