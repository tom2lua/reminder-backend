const eventTypesRouter = require('express').Router()
const EventType = require('../models/eventType')

eventTypesRouter.get('/', async (request, response, next) => {
  try {
    const eventTypes = await EventType.find({})
    response.json(eventTypes)
  } catch (error) {
    next(error)
  }
})

eventTypesRouter.post('/', async (request, response, next) => {
  try {
    const eventTypesObject = {
      name: request.body.name,
      iconClass: request.body.iconClass,
      representColor: request.body.representColor
    }

    const eventType = new EventType(eventTypesObject)
    const savedEventType = await eventType.save()

    response.status(201).json(savedEventType)
  } catch (error) {
    next(error)
  }
})

module.exports = eventTypesRouter
