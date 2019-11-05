const jwt = require('jsonwebtoken')
const settingsRouter = require('express').Router()
const Setting = require('../models/settings')
const User = require('../models/user')

//Fetch user settings
settingsRouter.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const settings = await Setting.findById(user.settings)
    response.json(settings)
  } catch (error) {
    next(error)
  }
})

//Create user settings after register
settingsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(404).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const settingsObject = {
      darkMode: request.body.darkMode,
      firstDayOfWeek: request.body.firstDayOfWeek,
      is12HourFormat: request.body.isHour12Format,
      isNotiEnabled: request.body.isNotiEnabled
    }

    const settings = new Setting(settingsObject)

    const savedSettings = await settings.save()
    user.settings = savedSettings
    await user.save()
    response.status(201).json(savedSettings)
  } catch (error) {
    next(error)
  }
})

//Update user settings
settingsRouter.put('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const settingsObject = {
      darkMode: request.body.darkMode,
      firstDayOfWeek: request.body.firstDayOfWeek,
      is12HourFormat: request.body.is12HourFormat,
      isNotiEnabled: request.body.isNotiEnabled
    }
    const user = await User.findById(decodedToken.id)
    const updatedSettings = await Setting.findByIdAndUpdate(
      user.settings,
      settingsObject,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )
    console.log(updatedSettings)
    response.json(updatedSettings)
  } catch (error) {
    next(error)
  }
})

module.exports = settingsRouter
