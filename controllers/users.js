const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('events', {
    firstName: 1,
    lastName: 1,
    date: 1,
    description: 1,
    location: 1,
    startTime: 1,
    endTime: 1,
    user: 1,
    repeatOption: 1
  })
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  const { username, password, email } = request.body
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      email,
      passwordHash
    })

    const savedUser = await user.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)

    response.json({ user: savedUser, token })
  } catch (exception) {
    next(exception)
  }
})
//Fetch one:
usersRouter.post('/username', async (request, response, next) => {
  try {
    const user = await User.findOne({ username: request.body.value })
    response.json(user)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.post('/email', async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.value })
    response.json(user)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
